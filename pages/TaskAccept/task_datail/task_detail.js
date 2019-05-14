// pages/taskAccept/task_datail/task_detail.js

//暂时采用以下数据模拟

var states = ['pending', 'doing', 'checking', 'other']
var task1 = {
  taskReward: 5,
  taskInfo: "地点广州大学城，时间在2.29，先到先得",
  taskName: "跑腿任务",
  imageURL: "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png",
  tags: ["跑腿", "广州", '待审核'],
  state: states[0],
  taskID: '1',
  questionnairePath: null
}
var task2 = {
  taskReward: 3,
  taskInfo: "调查问卷，关于奶牛APP的用户体验调查",
  taskName: "问卷任务",
  imageURL: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg",
  tags: ["问卷", "调查", '待验收'],
  state: states[2],
  taskID: '2',
  questionnairePath:'pages/wjxqList/wjxqList?activityId=39109067'
}



Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskID:'',
    taskReward:'',
    taskInfo:"",
    taskName:"",
    imageURL: "",
    state:'',
    tags:[],
    questionnairePath:null,

    images: [],

    //下面是状态栏的显示
    active: 0,
    steps: [
      {
        text: '待审核阶段',
        desc: '审核中，这里可以自己根据需要修改'
      },
      {
        text: '进行阶段',
        desc: '进行中，这里可以自己根据需要修改'
      },
      {
        text: '待验收阶段',
        desc: '您已经完成，正在审核中'
      },
      {
        text: '其他',
        desc: '未报名/已结束/已退出'
      }
    ]
  },

  /**
   * 跳转到问卷链接,使用问卷星APPID
   */
  navToQuestionnaire(){
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
   * 上传截图
   */
  uploadImage(){
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
      images:this.data.images
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
   * 提交问卷
   */
  submitTask(){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      taskID: options.taskID
    })

    //暂时用下面的作为效果展示
    if(this.data.taskID=='1'){
      this.setData({
        taskReward: task1.taskReward,
        taskInfo: task1.taskInfo,
        taskName: task1.taskName,
        imageURL: task1.imageURL,
        tags: task1.tags,
        state:task1.state,
        questionnairePath:task1.questionnairePath
      })
    }else if(this.data.taskID=='2'){
      this.setData({
        taskReward: task2.taskReward,
        taskInfo: task2.taskInfo,
        taskName: task2.taskName,
        imageURL: task2.imageURL,
        state: task2.state,
        tags:task2.tags,
        questionnairePath: task2.questionnairePath
      })
    }

    switch(this.data.state){
      case states[0]:{
        this.setData({
          active:0
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