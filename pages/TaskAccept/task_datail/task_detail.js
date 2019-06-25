
// pages/taskAccept/task_datail/task_detail.js
import Toast from '../../../dist/toast/toast';

//与后端交互请在submitTask函数内调试！！！

//暂时采用以下数据模拟


var states = ['pending', 'doing', 'checking', 'other']
var types = ['questionnaire', 'errand']


Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskID: '',
    taskReward: '',
    taskInfo: "",
    taskName: "",
    //任务的描述图片
    imageURL: "",
    state: '',
    tags: [],
    questionnairePath: null,
    type: '',
    //任务审核时用户上传的截图
    images: [],

    //下面是状态栏的显示
    active: 0,
    steps: [
      {
        text: '待审核阶段',
        desc: '审核中，你需要等待任务发布者的审核'
      },
      {
        text: '进行阶段',
        desc: '进行中，请在最终期限之前完成任务'
      },
      {
        text: '待验收阶段',
        desc: '您已经完成，正在验收中'
      },
      {
        text: '其他',
        desc: '未报名/已结束/已退出'
      }
    ]
  },

  /**
   * 提交问卷，这个是专门与后端进行调试的函数
   */
  submitTask() {
    //getApp().globalData.userInfo 可以获取已经获取的用户信息
    
    if (this.data.images.length == 0) {
      wx.showToast({
        title: '上传至少一张截图!',
        icon: 'none',
        duration: 2000
      })
      return
    }

    //接受者结算任务
    console.log(this.data.images)
    let taskPromise = new Promise((resolve, reject) => {
      console.log('POST /task/recipient/settleup/{taskId}')
      let failed = []
      wx.showToast({
        title: '图片上传中',
        icon: 'loading',
        duration: 10000
      })
      for (var imgIndex = 0; imgIndex < this.data.images.length; ++imgIndex) {
        wx.uploadFile({
          url: 'https://www.wtysysu.cn:10443/v1/task/recipient/settleup/' + this.data.taskID + '?userId=3',
          filePath: this.data.images[imgIndex],
          name: 'myfile',
          formData: {
            user: 3
          },
          header: {
            'accept': 'application/json',
          },
          success(res) {
            let data = JSON.parse(res.data)
            if (!data.success) {
              failed.push(String(imgIndex))
            }
            console.log(data)
            resolve(failed)
          }
        })
      }
    })

    taskPromise.then((resolve) => {
      if (resolve.length == 0) {
        wx.navigateTo({
          url: '../main/main?selection=3',
          success: () => {
            wx.showToast({
              title: '图片上传成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      } else {
        wx.showToast({
          title: '图片' + resolve.join(',') + '上传失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
    
  },

  /**
   * 报名活动
   */
  signUpTask() {
    
    //接受任务

    let taskPromise = new Promise((resolve, reject) => {
      console.log('POST /task/recipient/{taskId}')
      wx.request({
        url: 'https://www.wtysysu.cn:10443/v1/task/recipient/' + this.data.taskID + '?userId=3',
        method: 'POST',
        header: {
          'accept': 'application/json'
        },
        success(res) {
          console.log(res)
          resolve(res.data)
        }
      })
    })

    taskPromise.then((resolve) => {
      if (resolve.success) {
        wx.navigateTo({
          url: '../main/main?selection=3',
          success: () => {
            wx.showToast({
              title: resolve.message,
              icon: 'success',
              duration: 2000,
            })
          }
        })
      } else {
        wx.showToast({
          title: resolve.message,
          icon: 'none',
          duration: 2000,
        })
      }
      console.log('接受任务')
    })
    
    
  },


  /**
   * 跳转到问卷链接,使用问卷星APPID
   */
  navToQuestionnaire() {
    wx.navigateToMiniProgram({
      appId: 'wxd947200f82267e58',
      path: this.data.questionnairePath,
      extraData: {

      },
      success(res) {
        // 打开成功
      }
    })
  },

  /**
   * 进行跑腿任务，可以加上地图模块
   */
  navToErrand() {

  },

  /**
   * 上传截图
   */
  uploadImage() {
    
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        let upload_images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        upload_images = upload_images.length <= 3 ? upload_images : upload_images.slice(0, 3)
        console.log(upload_images)
        this.setData({
          images: upload_images
        })
      }
    })
  },

  /**
   * 移除图片
   */
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    this.setData({
      images: this.data.images
    })
  },

  /**
   * 处理点击图片预览
   */
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    //默认为other
    let taskState = states[3]

    //根据taskID获取对应任务的state   
    let statePromise = new Promise((resolve, reject) => {
      console.log('GET /task/recipient/{taskID}')
      console.log('options.taskID: ' + options.taskID)
      wx.request({
        url: 'https://www.wtysysu.cn:10443/v1/task/recipient/' + options.taskID + '?userId=3',
        method: 'GET',
        header: {
          'accept': 'application/json'
        },
        success(res) {
          console.log(res)
          if (res.data.state == null) {
            taskState = states[3]
          }
          else  {
            taskState = states[res.data.state]
          }
          
          resolve('ok')
        }
      })
    })
    statePromise.then((resolve)=>{
      console.log(taskState)
      this.setData({
        taskID: Number(options.taskID),
        taskReward: Number(options.taskReward),
        taskInfo: options.taskInfo,
        taskName: (options.type == types[0] ? "问卷任务" : "跑题任务"),
        imageURL: (options.type == types[0]) ? "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg" : "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png",
        tags: options.tags.split(' '),
        state: taskState,
        questionnairePath: (options.type == types[0] ? "pages/wjxqList/wjxqList?activityId=39109067" : null),
        type: options.type
      })

      switch (this.data.state) {
        case states[0]: {
          this.setData({
            active: 0
          })
          break
        }
        case states[1]: {
          this.setData({
            active: 1
          })
          break
        }
        case states[2]: {
          this.setData({
            active: 2
          })
          break
        }
        case states[3]: {
          this.setData({
            active: 3
          })
          break
        }


      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})