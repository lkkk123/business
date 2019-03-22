import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  AvatarList,
  Avatar,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  List,
  Upload,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from './MapList.less';
const { Description } = DescriptionList;
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'success', 'error','success','success','error','success','default'];
const status = ['待审核', '等待抢单', '已驳回', '已抢单','待验收','验收不通过','已完成','已取消'];
const type = ['移门','橱柜'];
const urgent = ['不加急','加急'];
const urgentCol = ['','加急'];
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({login}) => ({
  login,
}))
@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        gateId:props.values.gateId,
        name: props.values.name,
        logo:props.values.logo,
        notes: props.values.notes,
        price: props.values.price,
        urgent: props.values.urgent,
        hour:  props.values.hour,
        type: props.values.type,
        status:  props.values.status,
        images:props.values.images,
        address:props.values.address,
        lookNum:props.values.lookNum,
        releaseName:props.values.releaseName,
        releaseTime: props.values.releaseTime,
        receiptName: props.values.receiptName,
        returnNote:props.values.returnNote,
      },
      currentStep: 0,
      token:props.login.token,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  approvalStatus = (id,status) => {
    const { dispatch,handleUpdateModalVisible } = this.props;
    const { token } = this.state;
    dispatch({
      type: 'maps/approval',
      payload: {
      //  token,
        status:status,
        gateIds: id,
      },
      callback: () => {
        handleUpdateModalVisible();
        dispatch({
          type: 'maps/grapList',
          payload: {
           // token,
          },
        });
      },
    });
  };

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (formVals) => {
    const { form } = this.props;
    let receiptNameDiv = '';
    let receiptTimeDiv = '';
    let finishTimeDiv = '';
    let noteDivAf = '';
    let noteDiv = '';
    let returnAf = '';
    let returnDiv = '';
    if(formVals.receiptName){
      receiptNameDiv = <Description term="接单人">{formVals.receiptName}</Description>;
    }
    if(formVals.receiptTime){
      receiptTimeDiv = <Description term="开始时间">{formVals.receiptTime}</Description>;
    }
    if(formVals.finishTime){
      finishTimeDiv = <Description term="交货时间">{formVals.finishTime}</Description>;
    }
    if(formVals.notes){
      noteDivAf = <Divider type="horizontal" />;
      noteDiv = <DescriptionList className={styles.headerList} size="large" col="1">
        <Description term="备注">{formVals.notes}</Description>
      </DescriptionList>;
    }
    if(formVals.status === 5 && formVals.returnNote){
      returnAf = <Divider type="horizontal" />;
      returnDiv = <DescriptionList className={styles.headerList} size="large" col="1">
        <Description term="验收失败"><span style={{color:'red'}}>{formVals.returnNote}</span></Description>
      </DescriptionList>;
    }
    return [
      <Card type="inner" title="详情">
        <DescriptionList className={styles.headerList} size="large" col="2">
          <Description term=""><img width={200} height={200} src={formVals.logo} /></Description>
          <Description term="需求名">{formVals.name} <span style={{color:'red'}}>{formVals.urgent === 1 ? (urgent[formVals.urgent]) : ''}</span></Description>
          <Description term="类型">{type[formVals.type]}</Description>
          <Description term="状态">{status[formVals.status]}</Description>
          {receiptNameDiv}
          {receiptTimeDiv}
          {finishTimeDiv}
        </DescriptionList>
        {returnAf}
        {returnDiv}
        {noteDivAf}
        {noteDiv}
      </Card>

    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible } = this.props;
    const {  formVals } = this.state;
    if(formVals.status === 0){
      return [
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.approvalStatus(formVals.gateId,1)}>
          审核
        </Button>,
        <Button key="submit1" type="danger" onClick={() => this.approvalStatus(formVals.gateId,2)}>
          驳回
        </Button>,
      ];
    }else{
      return [
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => handleUpdateModalVisible()}>
          确定
        </Button>,
      ];
    }

  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible } = this.props;
    const {  formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        footer={this.renderFooter()}
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ maps,login, loading,setting }) => ({
  maps,
  login,
  setting,
  loading: loading.models.maps,
}))
@Form.create()
class GrapList extends PureComponent {
  state = {
    visibleUpload:false,
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    token:this.props.login.token,
    fileList:[],
  };

  columns = [
    {
      title: '需求',
      render: (text, record) => (
        <List.Item.Meta
          avatar={<Avatar src={record.logo} shape="square" size="large" />}
          title={record.name}
          description={urgentCol[record.urgent]}
        />
      ),
    },
    {
      title: '打图价格',
      dataIndex: 'price',
      sorter: true,
      render: val => `${val} 门图币`,
      // mark to display a total number
      // needTotal: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      // filters: [
      //   {
      //     text: status[0],
      //     value: 0,
      //   },
      //   {
      //     text: status[1],
      //     value: 1,
      //   },
      //   {
      //     text: status[2],
      //     value: 2,
      //   },
      //   {
      //     text: status[3],
      //     value: 3,
      //   },
      //   {
      //     text: status[4],
      //     value: 4,
      //   },
      //   {
      //     text: status[5],
      //     value: 5,
      //   },
      // ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '抢单时间',
      dataIndex: 'receiptTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.showTradeUpload(record)}>{(record.status === 3 || record.status === 5) ? '上传' : ''}</a>
          <Divider type="vertical" />
          <a onClick={() => this.validGiveUp(record)}>{(record.giveUp === true) ? '放弃任务' : ''}</a>
        </Fragment>
      ),
    },
  ];

   // 放弃任务检测
  validGiveUp = (record) =>{
    const { dispatch } = this.props;
    const { token } = this.state;
    dispatch({
      type: 'maps/validGiveUp',
      payload: {
     //   token,
        gateId:record.gateId,
      },
      callback: (response) => {
        if (response.code === 10000){
          this.showGiveUp(record,token,response.data.credit,response.data.deposit);
        }else{
          message.error(response.msg);
        }
      },
    });
  }

  showGiveUp = (record,token,credit,deposit) =>{
    const { dispatch } = this.props;
    Modal.confirm({
      title: '提示',
      content: '放弃任务将扣除'+credit+'信用分，'+deposit+'押金。确定放弃吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'maps/giveUp',
          payload: {
            //token,
            gateId:record.gateId,
          },
          callback: () => {
            dispatch({
              type: 'maps/grapList',
              payload: {
               // token
              },
            });
          },
        });
      },
    });
  }

  showTradeUpload = item => {
    this.setState({
      visibleUpload: true,
      current: item,
      fileList:[],
    });
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { token } = this.state;
    dispatch({
      type: 'maps/grapList',
      payload: {
       // token
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues,token } = this.state;


    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    //  token,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'maps/grapList',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { token } = this.state;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'maps/grapList',
      payload: {
        //token
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows,token } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'approval':
        dispatch({
          type: 'maps/approval',
          payload: {
          //  token,
            status:1,
            gateIds: selectedRows.map(row => row.gateId),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
            dispatch({
              type: 'maps/grapList',
              payload: {
              //  token
              },
            });
          },
        });
        break;
      case 'reject':
        dispatch({
          type: 'maps/approval',
          payload: {
          //  token,
            status:2,
            gateIds: selectedRows.map(row => row.gateId),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
            dispatch({
              type: 'maps/grapList',
              payload: {
              //  token
              },
            });
          },
        });
        break
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { token } = this.state;
    form.validateFields((err, fieldsValue) => {
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
       // token,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'maps/grapList',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    console.log(record);
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'maps/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'maps/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="需求名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/*<Col md={8} sm={24}>*/}
          {/*<FormItem label="状态">*/}
          {/*{getFieldDecorator('status')(*/}
          {/*<Select placeholder="请选择" style={{ width: '100%' }}>*/}
          {/*<Option value="">全部</Option>*/}
          {/*<Option value="0">待审核</Option>*/}
          {/*<Option value="1">已审核</Option>*/}
          {/*<Option value="2">已驳回</Option>*/}
          {/*<Option value="3">已接单</Option>*/}
          {/*<Option value="4">已完成</Option>*/}
          {/*<Option value="5">取消</Option>*/}
          {/*</Select>*/}
          {/*)}*/}
          {/*</FormItem>*/}
          {/*</Col>*/}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/*<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>*/}
              {/*展开 <Icon type="down" />*/}
              {/*</a>*/}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="需求名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/*<Col md={8} sm={24}>*/}
          {/*<FormItem label="类别">*/}
          {/*{getFieldDecorator('type')(*/}
          {/*<Select placeholder="请选择" style={{ width: '100%' }}>*/}
          {/*<Option value="">全部</Option>*/}
          {/*<Option value="0">移门</Option>*/}
          {/*<Option value="1">橱柜</Option>*/}
          {/*</Select>*/}
          {/*)}*/}
          {/*</FormItem>*/}
          {/*</Col>*/}
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="0">待审核</Option>
                  <Option value="1">已审核</Option>
                  <Option value="2">已驳回</Option>
                  <Option value="3">已接单</Option>
                  <Option value="4">已完成</Option>
                  <Option value="5">取消</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>*/}
          {/*<FormItem label="是否加急">*/}
          {/*{getFieldDecorator('urgent')(*/}
          {/*<Select  placeholder="请选择" style={{ width: '100%' }}>*/}
          {/*<Option value="">全部</Option>*/}
          {/*<Option value="0">不加急</Option>*/}
          {/*<Option value="1">加急</Option>*/}
          {/*</Select>*/}
          {/*)}*/}
          {/*</FormItem>*/}
          {/*</Col>*/}
          {/*<Col md={8} sm={24}>*/}
          {/*<FormItem label="发布人">*/}
          {/*{getFieldDecorator('releaseName')(<Input placeholder="请输入" />)}*/}
          {/*</FormItem>*/}
          {/*</Col>*/}
          <Col md={8} sm={24}>
            <FormItem label="发布日期">
              {getFieldDecorator('releaseTime')(
                <DatePicker  format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="请输入发布日期" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }
  handleUpload = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current,token,fileList } = this.state;
    const gateId = current ? current.gateId : '';
    if(!fileList || fileList.length<=0){
      message.error("请上传图片");
      return;
    }
    dispatch({
      type: 'maps/uploadMap',
      payload: { gateId,
       // token,
        images:fileList[0].url
      },
      callback: () => {
        this.setState({
          visibleUpload:false,
          fileList:[],
        });
        dispatch({
          type: 'maps/grapList',
          payload: {
            // token
          },
        });
      },
    });
  };
  handleCancel = ()=>{
    this.setState({
      visibleUpload: false,
    });
  }
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      maps: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,visibleUpload } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="approval">批量审批</Menu.Item>
        <Menu.Item key="reject">批量驳回</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );



    const getModalUpload = () => {
      const {
        form: { getFieldDecorator },
        setting
      } = this.props;
      const { fileList } = this.state;
      const { serverUrl } = setting;
      const setFileList =(data) =>{
        this.setState({
          fileList:data,
        })
      }
      const pross = {
        action: serverUrl + "/mapUpload",
        onChange({ file, fileList }) {
          if (file.status === 'done') {
            if(file.response.code === 10000){
              setFileList(file.response.data);
              message.success(file.response.msg);
            }else{
              setFileList([]);
              message.error(file.response.msg);
            }
          }
          if (file.status === 'removed') {
            setFileList([]);
            console.log(file, fileList);
          }
        },
      };
      const uploadButton = (
        <Button >
          <Icon type="upload" /> Upload
        </Button>
      );
      const uploadButtonDis = (
        <Button disabled>
          <Icon type="upload" /> Upload
        </Button>
      );
      return (
        <Form onSubmit={this.handleUpload}>
          <FormItem  {...this.formLayout}  labelCol={{ span: 40 }} wrapperCol={{ span: 40 }} label="请选择上传文件(文件格式为rar压缩文件)">
            {(
              <Upload {...pross}>
                {fileList.length >= 1 ? uploadButtonDis : uploadButton}
              </Upload>
            )}
            {/*<span style={{marginLeft:"40px" }}>文件格式为压缩文件(.rar)</span>*/}
          </FormItem>,
        </Form>
      );
    };
    const modalFooter = { okText: '保存', onOk: this.handleUpload, onCancel: this.handleCancel };
    return (
      <PageHeaderWrapper >
        {/*<Card bordered={false}>*/}
        {/*<Row>*/}
        {/*<Col sm={8} xs={24}>*/}
        {/*<Info title="待审核任务" value={data.groupCount.waitCount + "个需求"} bordered />*/}
        {/*</Col>*/}
        {/*<Col sm={8} xs={24}>*/}
        {/*<Info title="本周共计审核任务" value={data.groupCount.examineCount+"个需求"} />*/}
        {/*</Col>*/}
        {/*<Col sm={8} xs={24}>*/}
        {/*<Info title="本周完成交易" value={data.groupCount.successCount+"门图币"} bordered />*/}
        {/*</Col>*/}
        {/*</Row>*/}
        {/*</Card>*/}

        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {/*<div className={styles.tableListOperator}>*/}
            {/*<Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>*/}
            {/*新建*/}
            {/*</Button>*/}
            {/*{selectedRows.length > 0 && (*/}
            {/*<span>*/}
            {/*/!*<Button>批量操作</Button>*!/*/}
            {/*<Dropdown overlay={menu}>*/}
            {/*<Button>*/}
            {/*批量操作 <Icon type="down" />*/}
            {/*</Button>*/}
            {/*</Dropdown>*/}
            {/*</span>*/}
            {/*)}*/}
            {/*</div>*/}
            <StandardTable
              selectedRows={0}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
        <Modal
          title="上传"
          className={styles.standardListForm}
          width={400}
          destroyOnClose
          visible={visibleUpload}
          {...modalFooter}
        >
          {getModalUpload()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default GrapList;
