// pages/task_datail/task_detail.js

import Dialog from '../../../dist/dialog/dialog';

var states = ['pending', 'doing', 'finished']

var checkState=['unchecked','passed','unpassed']
var types = ['questionnaire', 'errand']

//暂时采用下面的数据模拟

var task1 = {
  taskReward: 5,
  taskInfo: "地点广州大学城，时间在2.29，先到先得",
  taskName: "跑腿任务",
  imageURL: "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png",
  tags: ["跑腿", "广州", '进行中'],
  state: states[1],
  taskID: '1',
  type: 'errand'
}
var task2 = {
  taskReward: 3,
  taskInfo: "调查问卷，关于奶牛APP的用户体验调查",
  taskName: "问卷任务",
  imageURL: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg",
  tags: ["问卷", "调查", '进行中'],
  state: states[1],
  taskID: '2',
  type: 'questionnaire'
}

var user1_data={
  
  state:checkState[0],
  userID:123,
  imagesURL:[
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558469542018&di=8208af6eb1a987d9dc431509aa7ad91d&imgtype=0&src=http%3A%2F%2Fi3.hexun.com%2F2018-06-23%2F193257855.jpg',
    'http://img3.imgtn.bdimg.com/it/u=2932025398,934944233&fm=26&gp=0.jpg',
    'http://img4.imgtn.bdimg.com/it/u=3475521849,1650563933&fm=26&gp=0.jpg']
}

var user2_data={
  state: checkState[1],
  userID: 256,
  imagesURL: [
    'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2103157768,145332811&fm=26&gp=0.jpg',
    'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1687278852,3241220207&fm=26&gp=0.jpg',
    'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=823267616,3499131309&fm=26&gp=0.jpg']
}

var user3_data={
  state: checkState[0],
  userID: 678,
  imagesURL: [
    'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=327905910,2036501133&fm=26&gp=0.jpg',
    'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=145022413,4184144031&fm=26&gp=0.jpg',
    'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1290220413,1365829772&fm=26&gp=0.jpg']
}


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
    
    //任务审核时用户上传的资料
    usersData: [],

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
        text: '已完成',
        desc: '您已经通过milky money完成本次活动'
      }
    ],
    
    //勾选全部的情况
    checked_all:false,

    
    /**
     * 验收列表的验收情况
     * 每一项的数据结构：
     * {  
     *  userID:
     *  checkState:
     * }
     */
    checks:[],

    //下面的用于显示复选框
    isPass:[],
    isUnPass:[],

    //支付的对话框
    showDialog: false,
    password: '',
    titleDialog:'您需要支付xx元'
  },

  /**
   * 支付窗口点击确认按钮时，会返回获取到的用户信息
   */
  getUserInfo(event) {
    //console.log(event.detail);
  },

  /**
   * 开启支付对话框
   */
  showCustomDialog() {
    this.setData({ showDialog: true });
  },

  /**
   * 输入密码 
   */
  onChangePassword(event){
    //console.log(event.detail)
  },

  /**
   * 关闭支付的对话窗口
   */
  onCloseDialog(event) {
    if (event.detail === 'confirm') {
      setTimeout(() => {
        this.setData({
          showDialog: false
        });
        wx.showToast({
          title: '支付成功',
          icon: 'success',
        })
       
      }, 1000);
    } else {
      this.setData({
        showDialog: false
      });
    }
  },


  /**
   * 验收单个
   */
  onChangeChecked(event) {
    //console.log(event.target.dataset)

    //console.log(event.detail)

    const userID=event.target.dataset.userid
    const checkType = event.target.dataset.checktype
    const index=event.target.dataset.idx

    if (checkType =='passed'){
      let isPassTemp=this.data.isPass
      let isUnPassTemp = this.data.isUnPass
      isPassTemp[index]=event.detail
      isUnPassTemp[index]=!event.detail

      this.setData({
        isPass: isPassTemp,
        isUnPass: isUnPassTemp
      })

      //console.log(isPassTemp)
    }else{
      //unPassed
      let isUnPassTemp=this.data.isUnPass
      let isPassTemp = this.data.isPass
      isUnPassTemp[index]=event.detail
      isPassTemp[index]=!event.detail

      this.setData({
        isUnPass: isUnPassTemp,
        isPass: isPassTemp,
      })
    }

 


  },

  /**
   * 勾选全部通过
   */
  onChangeCheckedAll(event){
    
    let isPassTemp = this.data.isPass
    let isUnPassTemp = this.data.isUnPass

    if(event.detail){
      for(let i=0;i<isPassTemp.length;i++){
        isPassTemp[i]=true
        isUnPassTemp[i]=false
      }
    }else{
      for (let i = 0; i < isPassTemp.length; i++) {
        isPassTemp[i] = false
      }
    }
    
    this.setData({
      checked_all: event.detail,
      isPass:isPassTemp,
      isUnPass:isUnPassTemp
    });
  },

  /**
   * 处理点击图片预览
   */
  handleImagePreview(e) {
    //console.log(e)

    const url=e.target.dataset.url
    wx.previewImage({
      current: url,
      urls: [url],
    })
    
  },

  /**
   * 提交验收评价
   */
  submitChecked(){
    //支付
    this.showCustomDialog()

    console.log('验收提交')

    let usersDataTemp=this.data.usersData
    //提交之后刷新页面
    for (let i = 0; i < usersDataTemp.length;i++){
      //对之前未验收的进行验收
      if (usersDataTemp[i].state == checkState[0]){
          if(this.data.isPass[i]){
            usersDataTemp[i].state = checkState[1]
          }else if(this.data.isUnPass[i]){
            usersDataTemp[i].state = checkState[2]
          }
      }
    }

    this.setData({
      usersData:usersDataTemp
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)


    //下面的数据都是暂时代替服务器的
    let usersDataTemp=[]
    usersDataTemp.push(user1_data)
    usersDataTemp.push(user2_data)
    usersDataTemp.push(user3_data)

    let checkTemp=[]
    let check1={
      userID:user1_data.userID,
      checkState:user1_data.state
    }
    let check2 = {
      userID: user2_data.userID,
      checkState: user2_data.state
    }
    let check3 = {
      userID: user3_data.userID,
      checkState: user3_data.state
    }
    checkTemp.push(check1)
    checkTemp.push(check2)
    checkTemp.push(check3)

    let isPassedTemp = new Array(checkTemp.length)
    let isUnpassedTemp=new Array(checkTemp.length)

    for (let i=0; i < checkTemp.length;i++){
      isPassedTemp[i]=false
      isUnpassedTemp[i]=false
    } 

    this.setData({
      taskID:options.taskID,
      usersData:usersDataTemp,
      checks:checkTemp,
      isPass:isPassedTemp,
      isUnPass:isUnpassedTemp
    })

    if (this.data.taskID == '1') {
      this.setData({
        taskReward: task1.taskReward,
        taskInfo: task1.taskInfo,
        taskName: task1.taskName,
        imageURL: task1.imageURL,
        tags: task1.tags,
        state: task1.state,
        type: task1.type
      })
    } else if (this.data.taskID == '2') {
      this.setData({
        taskReward: task2.taskReward,
        taskInfo: task2.taskInfo,
        taskName: task2.taskName,
        imageURL: task2.imageURL,
        state: task2.state,
        tags: task2.tags,
        type: task2.type
      })
    }

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