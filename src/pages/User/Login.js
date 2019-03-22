import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading,setting }) => ({
  login,
  setting,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  componentDidMount() {
    let query = this.props.location.query;
    let code = query.code;
    if(code){
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          code
        },
      });
    }else{
      const { setting } = this.props;
      const { weiXinUrl } = setting;
      console.log("===================>>>>"+ weiXinUrl);
      window.location.href=weiXinUrl; // 重定向微信登录
    }
  };

  handleSubmit = (err, values) => {
    const { setting } = this.props;
    const { weiXinUrl } = setting;
    console.log("===================>>>>"+ weiXinUrl);
    window.location.href=weiXinUrl; // 重定向微信登录
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    let content = "自动登录中...";
    let disable = true;
    if(login.status === 'error'){
      content = "重新登录";
      disable = false;
    }
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账号检测">
            {login.status === 'error' &&
              // login.type === 'account' &&
              // !submitting &&
              this.renderMessage(login.msg)}
            {/*<UserName name="userName" placeholder="admin/user" />*/}
            {/*<Password*/}
              {/*name="password"*/}
              {/*placeholder="888888/123456"*/}
              {/*onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}*/}
            {/*/>*/}
          </Tab>
          {/*<Tab key="mobile" tab="手机号登录">*/}
            {/*{login.status === 'error' &&*/}
              {/*login.type === 'mobile' &&*/}
              {/*!submitting &&*/}
              {/*this.renderMessage('验证码错误')}*/}
            {/*<Mobile name="mobile" />*/}
            {/*<Captcha name="captcha" countDown={120} onGetCaptcha={this.onGetCaptcha} />*/}
          {/*</Tab>*/}
          {/*<div>*/}
            {/*<Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>*/}
              {/*自动登录*/}
            {/*</Checkbox>*/}
            {/*/!*<a style={{ float: 'right' }} href="">*!/*/}
              {/*/!*忘记密码*!/*/}
            {/*/!*</a>*!/*/}
          {/*</div>*/}
          <Submit loading={submitting} disabled={disable} style={{backgroundColor:"#00ABFF",color:"#FFFFFF"}}>{content}</Submit>
          {/*<div className={styles.other}>*/}
            {/*其他登录方式*/}
            {/*<Icon type="alipay-circle" className={styles.icon} theme="outlined" />*/}
            {/*<Icon type="taobao-circle" className={styles.icon} theme="outlined" />*/}
            {/*<Icon type="weibo-circle" className={styles.icon} theme="outlined" />*/}
            {/*<Link className={styles.register} to="/User/Register">*/}
              {/*注册账户*/}
            {/*</Link>*/}
          {/*</div>*/}
        </Login>
      </div>
    );
  }
}

export default LoginPage;
