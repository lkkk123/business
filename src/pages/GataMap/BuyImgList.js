import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Avatar,
  List,
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
  Upload,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from './Atlas.less';
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
const statusMap = ['default', 'success', 'error'];
const status = ['未购买', '可下载', '已过期'];

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
      title="添加图库"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入名称！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});
@connect(({login,atlas,setting}) => ({
  login,
  atlas,
  setting
}))
@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        atlasId:props.values.atlasId || 0,
        logo:props.values.logo,
        name: props.values.name,
        categoryName:props.values.categoryName,
        categoryId:props.values.categoryId,
        price:props.values.price,
        keyWord:props.values.keyWord,
        status:props.values.status,
        notes:props.values.notes,
        images:props.values.images,
        size:props.values.size,
        byteSize:props.values.byteSize,
        format:props.values.format,
      },
      method:props.values.method ||  'atlas/updateAtlas',
      title:props.values.title || '',
      previewVisible: false,
      previewImage: '',
      fileList:props.values.images ?  [{
        uid: '0',
        url: props.values.images,
      }] : [],
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { method,fileList,formVals: oldValue } = this.state;
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
            if(!fileList || fileList.length<=0){
              message.error("请上传图片");
            }else{
              handleUpdate(formVals,method);
            }
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

  handleCancel = () => {
    this.setState({ previewVisible: false })
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    if(fileList.length>0){
      let file = fileList[0];
      if(file.response){
        if(file.response.code === 10000){
          let data =  file.response.data;
          message.success(file.response.msg);
          const { formVals  } = this.state;
          let newVals = {
            ...formVals,
            images:data[0].url,
            size:data[0].size,
            byteSize:parseInt(data[0].byteSize),
            format:data[0].format,
          };
          this.setState({
            formVals:newVals,
            fileList:data,
          })
        }else{
          this.setState({ fileList })
          message.error(file.response.msg);
        }
      }else{
        this.setState({ fileList })
      }
    }else{
      this.setState({ fileList })
    }
  }

  handleRemove = ({ file }) =>{
    if(confirm("确定要删除吗")){
      return true
    }else{
      return false;
    }
  }

  renderContent = (formVals) => {
    const { form } = this.props;
    let noteDivAf = '';
    let noteDiv = '';
    if(formVals.notes){
      noteDivAf = <Divider type="horizontal" />;
      noteDiv = <DescriptionList className={styles.headerList} size="large" col="1">
        <Description term="备注">{formVals.notes}</Description>
      </DescriptionList>;
    }
    return [
      <Card type="inner" title="详情">
        <DescriptionList className={styles.headerList} size="large" col="2">
          <Description term=""><img width={200} height={200} src={formVals.logo} /></Description>
          <Description term="名称">{formVals.name} </Description>
          <Description term="类型">{[formVals.categoryName]}</Description>
          <Description term="状态">{status[formVals.status]}</Description>
          <Description term="价格">{formVals.price} 打图币</Description>
          <Description term="大小">{formVals.status} KB</Description>
        </DescriptionList>
        {noteDivAf}
        {noteDiv}
      </Card>

    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible } = this.props;
    return <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
      取消
    </Button>;
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible } = this.props;
    const { currentStep, formVals,title } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={title}
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ atlas,login, loading }) => ({
  atlas,
  login,
  loading: loading.models.atlas,
}))
@Form.create()
class BuyImgList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    token:this.props.login.token,
  };

  columns = [
    {
      title:' ',
      dataIndex:'logo',
      render(val) {
        return  <Avatar src={val} shape="square" size="large" />;
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'categoryName',
    },
    {
      title: '价格',
      dataIndex: 'price',
      sorter: true,
      render: val => `${val} `,
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
        {
          text: status[2],
          value: 2,
        },
        {
          text: status[3],
          value: 3,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '购买时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.downloadIamge(record)}>{(record.status === 1) ? '下载' : ''}</a>
        </Fragment>
      ),
    },
  ];

  downloadIamge = (record) => {
    // 将图片的src属性作为URL地址
    let url = record.images;
    let a = document.createElement('a');
    let event = new MouseEvent('click');
    a.href = url;
    a.dispatchEvent(event);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const { token } = this.state;
    dispatch({
      type: 'atlas/getAllCategory',
      payload: {},
    });
    dispatch({
      type: 'atlas/fetch',
      payload: {
      //  token
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
      type: 'atlas/fetch',
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
      type: 'atlas/fetch',
      payload: {
      //  token
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
      case 'online':
        dispatch({
          type: 'atlas/updateStatusByAtlas',
          payload: {
           // token,
            status:1,
            atlasIds: selectedRows.map(row => row.atlasId),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
            dispatch({
              type: 'atlas/fetch',
              payload: {
             //   token
              },
            });
          },
        });
        break;
      case 'offline':
        dispatch({
          type: 'atlas/updateStatusByAtlas',
          payload: {
          //  token,
            status:2,
            atlasIds: selectedRows.map(row => row.atlasId),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
            dispatch({
              type: 'atlas/fetch',
              payload: {
               // token
              },
            });
          },
        });
        break;
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
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
     //   token
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'atlas/fetch',
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
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleUpdateModalVisibleEX = (flag) => {
    let record = {
      title:"添加",
      method:'atlas/addAtlas',
    };
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'atlas/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = (fields,method) => {
    const { dispatch } = this.props;
    const { token } = this.state;
    dispatch({
      type: method,
      payload: {
        ...fields
      },
      callback: () => {
        this.handleUpdateModalVisible();
        dispatch({
          type: 'atlas/fetch',
          payload: {
         //   token
          },
        });
      },
    });
  };



  renderSimpleForm() {
    const {
      atlas: { categorys },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('categoryId')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {categorys.map(item => (
                    <Select.Option key={item.categorryId.categoryName} value={item.categorryId}>
                      {item.categoryName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  renderForm() {
    return  this.renderSimpleForm();
  }

  render() {
    const {
      atlas: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="online">批量上线</Menu.Item>
        <Menu.Item key="offline">批量下线</Menu.Item>
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
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {/*<div className={styles.tableListOperator}>*/}
              {/*<Button icon="plus" type="primary" onClick={() => this.handleUpdateModalVisibleEX(true)}>*/}
                {/*添加*/}
              {/*</Button>*/}
              {/*{selectedRows.length > 0 && (*/}
                {/*<span>*/}
                  {/*/!*<Button>批量操作</Button>*!/*/}
                  {/*<Dropdown overlay={menu}>*/}
                    {/*<Button>*/}
                      {/*操作 <Icon type="down" />*/}
                    {/*</Button>*/}
                  {/*</Dropdown>*/}
                {/*</span>*/}
              {/*)}*/}
            {/*</div>*/}
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {
          stepFormValues && Object.keys(stepFormValues).length ?
            (
              <UpdateForm
                {...updateMethods}
                updateModalVisible={updateModalVisible}
                values={stepFormValues}
              />
            ) : null
        }
      </PageHeaderWrapper>
    );
  }
}

export default BuyImgList;
