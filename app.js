//app.js
App({
  globalData: {
    userInfo: null,
    sessionKey: null
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var res_code = res.code
          console.log('GET /user/login')
          console.log('wx.login return code: ' + res_code)
          wx.request({
            url: 'https://www.wtysysu.cn:10443/v1/user/login?code=' + res_code,
            method: 'GET',
            header: {
              'accept': 'application/json',
              'content-type': 'application/json'
            },
            success:res=> {
              console.log(res)
              console
              var session_key = res.header['Set-Cookie'].split(';')[0]
              console.log('session key: ' + session_key)
              this.globalData.sessionKey=session_key
            }
          })
        }
        else {
          console.log('登录失败！' + res.errMsg)

        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  
})