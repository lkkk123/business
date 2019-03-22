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
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Atlas.less';

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
const status = ['未上线', '已上线', '已下线'];

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
      title="添加类型"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('categoryName', {
          rules: [{ required: true, message: '请输入类型名称！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="序号">
        {form.getFieldDecorator('index', {
           rules: [{ required: true, message: '请输入大于或等于的0序号'  }],
        })(<InputNumber defaultValue={0}   min={0}  placeholder="请输入" />)}
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
        categorryId:props.values.categorryId,
        categoryName: props.values.categoryName,
        index: props.values.index,
        status: props.values.status,
      },
      currentStep: 0,
      token:props.login.token,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = () => {
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
          handleUpdate(formVals);
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

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    return [
      <FormItem key="categoryName" {...this.formLayout} label="名称">
        {form.getFieldDecorator('categoryName', {
          rules: [{ required: true, message: '请输入类型名称！' }],
          initialValue: formVals.categoryName,
        })(<Input placeholder="请输入"  />)}
      </FormItem>,
      <FormItem key="index" {...this.formLayout} label="序号">
        {form.getFieldDecorator('index', {
          rules: [{ required: true, message: '请输入大于或等于的0序号'}],
          initialValue: formVals.index,
        })(<InputNumber defaultValue={0}   min={0}  placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="status" {...this.formLayout} label="状态">
        {form.getFieldDecorator('status', {
          initialValue: formVals.status,
        })(
          <Select style={{ width: '100%' }}>
            <Option value={0}>未上线</Option>
            <Option value={1}>已上线</Option>
            <Option value={2}>已下线</Option>
          </Select>
        )}
      </FormItem>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleNext()}>
        完成
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="编辑类型"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ caty,login, loading }) => ({
  caty,
  login,
  loading: loading.models.caty,
}))
@Form.create()
class AtlasCategory extends PureComponent {
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
      title: '类型名称',
      dataIndex: 'categoryName',
    },
    {
      title: '序号',
      dataIndex: 'index',
      sorter: true,
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
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          {/*<Divider type="vertical" />*/}
          {/*<a href="">订阅警报</a>*/}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'caty/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'caty/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'caty/fetch',
      payload: {},
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
          type: 'caty/upCateStatus',
          payload: {
            token,
            status:1,
            categorryIds: selectedRows.map(row => row.categorryId),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
            dispatch({
              type: 'caty/fetch',
              payload: {},
            });
          },
        });
        break;
      case 'offline':
        dispatch({
          type: 'caty/upCateStatus',
          payload: {
            token,
            status:2,
            categorryIds: selectedRows.map(row => row.categorryId),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
            dispatch({
              type: 'caty/fetch',
              payload: {},
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

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'caty/fetch',
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

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'caty/addCategory',
      payload: {
        categoryName: fields.categoryName,
        index:fields.index,
      },
      callback: () => {
        this.handleModalVisible();
        dispatch({
          type: 'caty/fetch',
          payload: {},
        });
      },
    });

    // message.success('添加成功');
    // this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'caty/updateCategory',
      payload: {
        ...fields
      },
      callback: () => {
        this.handleUpdateModalVisible();
        dispatch({
          type: 'caty/fetch',
          payload: {},
        });
      },
    });

    // message.success('配置成功');
    // this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="类型名称">
              {getFieldDecorator('categoryName')(<Input placeholder="请输入" />)}
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
      caty: { data },
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
      <PageHeaderWrapper >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  {/*<Button>批量操作</Button>*/}
                  <Dropdown overlay={menu}>
                    <Button>
                      操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              rowSelection={{
                hideDefaultSelections: false,
              }}
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
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default AtlasCategory;
