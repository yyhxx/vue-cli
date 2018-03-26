<template>
  <div class="login-container">
    <h2>登录</h2>
    <div class="login-box">
      <div class="tab-switch">
        <span @click="currentMethod='pwdLogin'" :class="currentMethod==='pwdLogin'?'active':''">账号密码登录</span>
        <span @click="currentMethod='codeLogin'" :class="currentMethod==='codeLogin'?'active':''">验证码登录</span>
      </div>
      <div class="switch-list">
        <div class="switch-list_item pwdLogin" v-if="currentMethod==='pwdLogin'">
          <!-- 用户名输入框 -->
          <div class="input-box">
            <input type="number" placeholder="请输入手机号" v-model="mobilePhone" maxlength="11">
          </div>
          <!-- 密码输入框 -->
          <div class="input-box">
            <!-- 密码明文的显示与隐藏 start -->
            <input type="password" placeholder="请输入密码" maxlength="16" v-model="password" v-if="pwdHidden">
            <input type="email" placeholder="请输入密码" maxlength="16" v-model="password" v-if="!pwdHidden">
            <!-- 密码明文的显示与隐藏 end -->
            <div class="see-icon" :class="pwdHidden?'hidden':''" @click="switchShow"></div>
          </div>
        </div>
        <div class="switch-list_item codeLogin" v-if="currentMethod==='codeLogin'">
          <div class="input-box">
            <input type="number" placeholder="请输入手机号" v-model="mobilePhone" maxlength="11">
          </div>
          <!-- 密码输入框 -->
          <div class="input-box">
            <input type="number" placeholder="请输入验证码" v-model="vCode">
            <span v-if="timeOut">已发送（{{leftTime}}s）</span>
            <span class="reget" v-if="!timeOut" @click="getCode">{{getCodeText}}</span>
          </div>
        </div>
      </div>
      <button class="confirm-button" v-bind:disabled="disabled" @click="confirmLogin">登&nbsp;&nbsp;录</button>
      <div class="forgetPwd" v-if="currentMethod=='pwdLogin'">
        <router-link to="/user/forget">忘记密码？</router-link>
      </div>
      <div class="toRegister">
        <p>没有账号，</p>
        <router-link to="/user/register">去注册</router-link>
        <span><img src="../../../static/images/icon_sqh@2x.png"></span>
      </div>
    </div>

    <!-- 验证码组件 -->

    <captcha-box v-if="showCaptcha" @verifySuccess="verifySuccess" @hideCaptcha="hideCaptcha" :captchaToken="captchaToken"></captcha-box>
  </div>
</template>
<style lang="scss" scoped>
@import "../../../static/scss/pages/user/login.scss";
</style>
<script>
import { checkPhone, setCookie, getCookie } from "@/utils/tools";
//导入图形验证码组件
import captchaBox from "../../../components/captchaBox/index";
export default {
  components: {
    captchaBox
  },
  data() {
    return {
      currentMethod: "pwdLogin",
      mobilePhone: "",
      password: "",
      vCode: "",
      captchaToken: "",
      timeOut: false,
      leftTime: 60,
      getCodeText: "获取验证码",
      timer: null,
      disabled: true,
      pwdHidden: true,
      showCaptcha: false, //是否显示图形验证码
      showRegister: true //是否展示去注册按钮
    };
  },
  watch: {
    password() {
      this.handleClick();
    },
    vCode() {
      this.handleClick();
    },
    mobilePhone() {
      this.handleClick();
    },
    leftTime(curVal, oldVal) {
      if (curVal <= 0) {
        clearInterval(this.timer);
        this.getCodeText = "重新获取";
        this.leftTime = 60;
        this.timeOut = false;
      }
    }
  },
  methods: {
    switchShow() {
      this.pwdHidden = !this.pwdHidden;
    },

    confirmLogin(obj) {
      if (this.currentMethod === "pwdLogin") {
        /* 账号密码登录进行验证 */
        if (this.password.length > 0) {
          obj.target.innerText = "登录中...";
          var loading = this.$toast({
            type: "loading",
            duration: 0,
            message: "正在登录",
            shadow: true
          });
          this.handleLogin(
            "password",
            this.mobilePhone,
            () => {
              loading.close();
              obj.target.innerText = "登录";
            },
            () => {
              loading.close();
              obj.target.innerText = "登录";
            }
          );
        } else {
          this.$toast({
            type: "text",
            message: "请输入密码！"
          });
        }
      } else if (this.currentMethod === "codeLogin") {
        /* 验证码登录进行验证 */
        if (this.vCode.length > 0) {
          obj.target.innerText = "登录中...";
          var loading = this.$toast({
            type: "loading",
            message: "正在登录",
            duration: 0,
            shadow: true
          });
          this.handleLogin("", this.mobilePhone, () => {
            loading.close();
            obj.target.innerText = "登录";
          });
        } else {
          this.$toast({
            type: "text",
            message: "请输入验证码！"
          });
        }
      }
    },
    getCode() {
      /* 获取验证码前先判断是否输入手机号 */
      if (checkPhone(this.mobilePhone) && this.leftTime === 60) {
        /* 判断手机号是否注册 */
        this.$http
          .post("login/verify-mobile-phone", {
            mobilePhone: this.mobilePhone
          })
          .then(res => {
            if (res.data.data.isRegister) {
              this.$http
                .post("login/get-verification-code", {
                  mobilePhone: this.mobilePhone
                })
                .then(res => {
                  if (res.data.rc === 0) {
                    //获取验证码成功
                    if (res.data.data.isHaveCaptcha) {
                      this.captchaToken = res.data.data.captcha_token;
                      this.showCaptcha = true;
                    } else {
                      this.$toast({
                        message: "验证码获取成功"
                      });
                      this.setTimeOut();
                    }
                  } else {
                    this.$toast({
                      type: "text",
                      message: res.data.msg
                    });
                  }
                });
            } else {
              this.$toast({
                message: "手机号未注册"
              });
            }
          });
      } else {
        this.$toast({
          type: "text",
          message: "请输入正确手机号"
        });
      }
    },
    setTimeOut() {
      this.timeOut = true;
      this.timer = setInterval(() => {
        this.leftTime -= 1;
      }, 1000);
    },
    handleClick() {
      if (
        this.mobilePhone.length === 11 &&
        (this.vCode.length > 0 || this.password.length > 0)
      ) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    handleLogin(method, mobilePhone, success, fail) {
      this.$http
        .post("login/", {
          mobilePhone: mobilePhone,
          verificationCode: this.vCode,
          password: this.password,
          type: method
        })
        .then(res => {
          // console.log(res);
          success ? success() : "";
          if (res.data.rc === 0) {
            setCookie("isLogin", true);
            this.$toast({
              type: "text",
              message: "登录成功",
              duration: 1000
            });
            /* token存入cookie中 */
            setCookie("Authorization", "Base " + res.data.data.token.data); //token
            setCookie("realName", res.data.data.userinfo.realName); //用户名
            setCookie("userId", res.data.data.userinfo.id); //用户id
            setCookie("userTel", res.data.data.userinfo.mobileNo); //手机号
            setCookie("ID", res.data.data.userinfo.identityNo); //身份证号
            // setCookie('isReservation',res.data.data.isReservation)//是否存在团检预约
            // console.log(this.$route);
            
            if (this.$route.query.target) {
              setTimeout(() => {
                this.$router.replace(
                  decodeURIComponent(this.$route.query.target)
                );
              }, 1000);
            } else {
              /* 是否鉴权 */
              if (res.data.data.isAuth) {
                /* 已经鉴权 */
                /* 如果存在团建预约 */
                if (res.data.data.isReservation) {
                  setTimeout(() => {
                    this.$router.push("/user/auth/result");
                  }, 1000);
                } else {
                  setTimeout(() => {
                    this.$router.push("/hospital/list");
                  }, 1000);
                }
              } else {
                setTimeout(() => {
                  this.$router.push("/user/auth");
                }, 1000);
              }
            }
          } else {
            this.$toast({
              type: "text",
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          fail ? fail() : "";
        });
    },
    verifySuccess() {
      console.log("验证成功");
      this.setTimeOut();
    },
    hideCaptcha(status) {
      this.showCaptcha = !status;
    }
  }
};
</script>
