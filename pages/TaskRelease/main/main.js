// pages/taskRelease/main/main.js
import Dialog from '../../../dist/dialog/dialog';

//submit task函数可用于后台调试
 
//发布方，state对应为[4,5,6]
var states = ['pending', 'doing', 'finished']
var types = ['questionnaire', 'errand']



Page({

  /**
   * 页面的初始数据
   */
  data: {
    location_city: '广州',
    /*默认停留在主页
      0:主页
      1:查询
      3：任务
      4：账户
    */
    selection:3,
    //底部图标
    active: 3,

    //搜索框输入
    search_value:'',

    //待审核，进行中，已完成
    //taskList用来存放未被分类的任务
    taskList: [],

    myPendingTasks: [],
    myDoingTasks: [],
    myFinishedTasks: [],

    userInfo: null,

    //msgNumber表示个人信息通知数量
    msgNumber: 0,

    //发布的任务类型，0-问卷，1-跑腿
    taskTypeSelection:'0',
    taskDDL:'',
    taskReward:1,
    taskName:'',
    taskInfo:'',
    tags:'',
    taskMaxAccept:1,

    taskQuestionID: 39109067,

    // 判断提交是否为创建还是修改类型
    isModifyTask:false,

    //钱包余额
    balance:0,

    //当前页数
    currentPage:0,

    currentDate: new Date().getTime(),
    show: {
      middle: false,
      top: false,
      bottom: false,
      right: false,
      right2: false
    },

    //充值对话框
    showDialog: false,
    rechargeBalance: 0,
    titleDialog: '充值金额(元)',
    msgDialog:''
  },

  /**
   * 充值处理
   */
  recharge(){
    //开启对话框
    this.setData({ showDialog: true });
  },

  /**
   * 输入充值数额
   */
  onChangeRechargeBalance(event){
    this.setData({
      rechargeBalance: event.detail
    })
    
  },

  /**
   * 确认充值,确认按钮的微信开放能力，此处暂时不用
   */
  rechargeConfirm(){
    
  },

  /**
   * 关闭充值的对话窗口
   */
  onCloseDialog(event) {
    console.log(event)
    if (event.detail === 'confirm') {
      let rechargeNum=Number(this.data.rechargeBalance)
      if (!Number.isInteger(rechargeNum) || rechargeNum <= 0 ){
        this.setData({
          showDialog: false
        });
        wx.showToast({
          title: '输入错误，充值失败',
          icon: 'none'
        })
        return 
      }

      let balance=this.data.balance

      new Promise((resolve,reject)=>{

        //这里可以向服务器发送充值命令，
        //当前金额为this.data.balance，本次充值金额为rechargeNum

        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/user/balance?userId=2',
          method: 'PUT',
          header: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          data: {
            "recharge":rechargeNum
          },
          success(res) {
            console.log(res)
            resolve(res)
          }
        })
      }).then((res)=>{
        return new Promise((resolve,reject)=>{
          wx.request({
            url: 'https://www.wtysysu.cn:10443/v1//user/?' + 'userId=2',
            method: 'GET',
            header: {
              'accept': 'application/json'
            },
            success(res) {
              balance = res.data.balance
              resolve('ok')
            }
          })
        })
      }).then((res)=>{
        this.setData({
          showDialog: false,
          balance: balance
        });
        wx.showToast({
          title: '充值成功',
          icon: 'success',
        })
      })
 
    } else {
      this.setData({
        showDialog: false
      });
    }
  },

  /**
   * 底部弹出选择
   */
  onTransitionEnd() {
  },

  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type],
      selectedInfo: this.data.areaSelected + " " + this.data.taskTypeSelected + " " + this.data.sortOrderSelected,
    });
  },

  toggleBottomPopup() {
    this.toggle('bottom');
  },

  onCancel() {
    this.toggleBottomPopup()
  },

  onConfirmDDL(event) {
    const { detail, currentTarget } = event;
    const date = new Date(detail);
    const dataStr = date.toLocaleString()
    this.setData({
      taskDDL: dataStr
    })
    this.toggleBottomPopup()
  },

  /**
   * 提交审核，这里也可调试
   * 
   * 提交之后跳转到已发布任务界面，发布者可以查看自己发布的任务情况
   */
  submitTask() {
    console.log(this.data)
    //异常处理
    console.log(this.data.taskName.length)
    if (this.data.taskName.length==0){
      wx.showToast({
        title: '任务名不能空!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.taskName.length>20){
      wx.showToast({
        title: '任务名过长!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.taskInfo.length == 0) {
      wx.showToast({
        title: '任务描述不能空!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.taskInfo.length>300) {
      wx.showToast({
        title: '任务描述过长!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    let tmpTags = this.data.tags.split(/\s+/)
    let cleanTags = []
    for (let i = 0; i < tmpTags.length; ++i) {
      if (tmpTags[i] != "") {
        if (tmpTags[i].length > 10) {
          wx.showToast({
            title: '单个标签过长!',
            icon: 'none',
            duration: 2000
          })
          return
        }
        cleanTags.push(tmpTags[i])
      }
    }
    console.log(cleanTags.length)
    if (cleanTags.length == 0) {
      wx.showToast({
        title: '标签不能空!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    let notANumRegex = /[^0-9]/i
    if (notANumRegex.exec(this.data.taskQuestionID) != null) {
      wx.showToast({
        title: '问卷ID必须为数字类型!',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (this.data.taskDDL.length == 0) {
      wx.showToast({
        title: '任务时间不能空!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    //这里可以发布新任务，也是修改任务的地方
    if (!this.data.isModifyTask) {
      let taskPromise = new Promise((resolve, reject) => {
        console.log('POST /task/publisher')
        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/task/publisher/?userId=2',  
          method: 'POST',
          header: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          data: {
            'type': types[Number(this.data.taskTypeSelection)],
            'description': this.data.taskInfo,
            'reward': this.data.taskReward,
            'deadline': this.data.taskDDL,
            'label': this.data.tags,
            'taskName': "",
            'priority': 0,
            'maxAccept': this.data.taskMaxAccept,
            'hasAccept': 0,
            'questionnaireID': types[Number(this.data.taskTypeSelection)] == 'questionnaire' ? Number(this.data.taskQuestionID) : null
          },
          success(res) {
            console.log(res)
            resolve(res.data)
          }
        })
      })

      taskPromise.then((resolve) => {
        if (resolve.success) {
          //完成发布或者修改
          wx.showToast({
            title: '发布成功', // '已发布成功/修改'
            icon: 'success',
            duration: 2000,
            success: () => {
              //跳转界面
              this.setData({
                selection: 3,
                active: 3
              });
              this.onPullDownRefresh()
            }
          })
        } else {
          wx.showToast({
            title: '发布失败',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    } else {
      let taskPromise = new Promise((resolve, reject) => {
        console.log('PUT /task/publisher/{taskId}')
        console.log(this.data.tags)
        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/task/publisher/' + this.data.taskID + '?userId=2',
          method: 'PUT',
          header: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          data: {
            'type': types[Number(this.data.taskTypeSelection)],
            'description': this.data.taskInfo,
            'reward': this.data.taskReward,
            'deadline': this.data.taskDDL,
            'label': this.data.tags,
            'taskName': "",
            'priority': 0,
            'maxAccept': this.data.taskMaxAccept,
            'hasAccept': 0,
            'userid': 2,
            'questionnaireID': types[Number(this.data.taskTypeSelection)] == 'questionnaire'? Number(this.data.taskQuestionID) : null
          },
          success(res) {
            
            console.log(res)
            resolve(res.data)
          }
        })
      })

      taskPromise.then((resolve) => {
        if (resolve.success) {
          //完成发布或者修改
          wx.showToast({
            title: '修改成功', // '已发布成功/修改'
            icon: 'success',
            duration: 2000,
            success: () => {
              //跳转界面
              this.setData({
                selection: 3,
                active: 3
              });
              this.onPullDownRefresh()
            }
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    }
    
    console.log('提交审核')
  },

  /**
   * 跳转到任务详情界面
   */

  navToTaskDetail(event){
    //console.log(event.target)
    wx.navigateTo({
      url: '../task_datail/task_detail?taskID=' + event.target.id,
    })
  },

  /**
   * 选择时间
   */
  chooseTime() {
    this.toggleBottomPopup()
  },

  /**
   * 选择参与人数
   */
  onChangeMaxAccept(event){
    this.setData({
      taskMaxAccept:event.detail
    })
    console.log(this.data.taskMaxAccept)
  },

  /**
   * 选择人均报酬
   */
  onChangeReward(event){
    this.setData({
      taskReward:event.detail
    })
  },

  /**
   * 选择发布的任务类型
   */
  onClickReleaseTaskType(event){
    const { value } = event.currentTarget.dataset;
    this.setData({
      taskTypeSelection: value
    });
  },

  /**
   * 设置问卷星的问卷链接
   */
  onChangeTaskQuestionID({detail}){
    this.setData({
      taskQuestionID:detail
    })
  },

  /**
   * 输入发布任务名
   */
  onChangeTaskName({ detail }){
    this.setData({
      taskName:detail
    })
  },

  /**
   * 输入任务描述
   */
  onChangeTaskInfo({ detail }) {
    this.setData({
      taskInfo:detail
    })
  },

  /**
   * 输入任务标签
   */
  onChangeTaskTags({ detail }) {
    this.setData({
      tags: detail
    })
  },





  /**
   * 底部页面选择
   */
  onChange: function(event) {
    this.setData({
      selection:event.detail,
      active: event.detail
    });

    //跳转到接受任务界面  
    if(this.data.selection==2){
      wx.redirectTo({
        url: '../../TaskAccept/main/main',
      })
    } else if (this.data.selection==0 || this.data.selection==4) {
      if (this.data.isModifyTask == true) {
        this.data.isModifyTask = false
      }
      this.onPullDownRefresh()
    } else if (this.data.selection==3) {
      this.onPullDownRefresh()
    }


  },
  
  /**
   * 切换任务袋的tab
   */
  onChangeTab(event) {
   
  },

  preparePendingTasks() {
    let listTemp = this.data.myPendingTasks
    this.data.taskList.forEach(task => {
      if (task.state == states[0]) {
        listTemp.push(task)
        this.setData({
          myPendingTasks: listTemp,
        })
      }
    })
  },
  prepareDoingTasks() {
    let listTemp = this.data.myDoingTasks
    this.data.taskList.forEach(task => {
      if (task.state == states[1] || !task.state) {
        listTemp.push(task)
        this.setData({
          myDoingTasks: listTemp,
        })
      }
    })
  },
  prepareFinishedTasks(){
    let listTemp = this.data.myFinishedTasks
    this.data.taskList.forEach(task => {
      if (task.state == states[2]) {
        listTemp.push(task)
        this.setData({
          myFinishedTasks: listTemp,
        })
      }
    })
  },




  /**
   * 搜索页面
   */
  onSearchChange:function(input){
    this.setData({
      search_value:input.detail
    })
  },
  onSearch:function(){
    if(this.data.search_value){
      wx.showToast({
        title:'搜索:'+this.data.search_value
      });
    }
  },
  


  /**
   * 生命周期函数--监听页面加载
   * 将获取到的任务装入taskList
   */
  onLoad: function (options) {
    //处理修改任务的跳转
    if (options.info) {
      let info=JSON.parse(options.info)
      this.setData({
        taskTypeSelection: info.taskTypeSelection,
        taskDDL: info.taskDDL,
        taskReward: info.taskReward,
        taskName: info.taskName,
        taskInfo: info.taskInfo,
        tags: info.tags.join(" "),
        taskMaxAccept: info.taskMaxAccept,
        selection: 1,
        active: 1,
        taskID: info.taskID,
        isModifyTask:true,
        currentPage:0
      })

    } else {
      let balance=this.data.balance
      let taskList = this.data.taskList

    //将获取到的任务装入taskList

    let taskPromise = new Promise((resolve, reject) => {
      console.log('GET /task/publisher')
      console.log('search_value: ' + this.data.search_value)
      wx.request({
        url: 'https://www.wtysysu.cn:10443/v1/task/publisher?page=0&keyword=' + this.data.search_value + '&userId=2',
        method: 'GET',
        header: {
          'accept': 'application/json'
        },
        success(res) {
          console.log(res)
          if (Array.isArray(res.data)) {
            res.data.forEach(function (atask) {
              let taskTag = atask.label.split(/\s+/)
              let imgURL = (atask.type == types[0]) ? "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg" : "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png"
              let _atask = {
                taskReward: atask.reward,
                taskInfo: atask.description,
                taskName: (atask.type == types[0]) ? "问卷任务" : "跑腿任务",
                imageURL: imgURL,
                tags: taskTag,
                state: states[atask.state - 4],
                taskID: atask.tid
              }
              taskList.push(_atask)
            })
            resolve('ok')
          }
          resolve('null')
        }
      })
    })
    taskPromise.then((res) => {
      return new Promise((resolve,reject)=>{

        //获取账户余额

        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1//user/?' + 'userId=2',
          method: 'GET',
          header: {
            'accept': 'application/json'
          },
          success(res) {
            balance=res.data.balance
            resolve('ok')
          }
        })

      })

    }).then((res)=>{
      
      this.setData({
        taskList: taskList,
        userInfo: getApp().globalData.userInfo,
        myPendingTasks: [],
        myDoingTasks: [],
        myFinishedTasks: [],
        isModifyTask: false,
        balance:balance,
        currentPage: 0
      })

      
      console.log(taskList)

      this.preparePendingTasks()
      this.prepareDoingTasks()
      this.prepareFinishedTasks()
      this.setData({
        taskList: []
      })

    })

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
   * 用户下拉，进行刷新
   */
  onPullDownRefresh: function () {
    
    //当用户在已发布的任务界面时  
    //下拉，刷新用户的已发布列表
    if (this.data.selection==3){
      //在标题栏中显示加载
      wx.showNavigationBarLoading()


      //这里增加刷新函数
      let taskList = this.data.taskList
      let balance=this.data.balance

      //将获取到的push到taskList
      new Promise((resolve,reject)=>{
        console.log('GET /task/publisher')
        console.log('search_value: ' + this.data.search_value)
        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/task/publisher?page=0&keyword=' + this.data.search_value + '&userId=2',
          method: 'GET',
          header: {
            'accept': 'application/json',
          },
          success(res) {
            console.log(res)
            if (Array.isArray(res.data)){
              res.data.forEach(function (atask) {
                let taskTag = atask.label.split(/\s+/)
                let imgURL = (atask.type == types[0]) ? "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg" : "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png"
                let _atask = {
                  taskReward: atask.reward,
                  taskInfo:atask.description,
                  taskName: (atask.type == types[0]) ? "问卷任务" : "跑腿任务",
                  imageURL: imgURL,
                  tags: taskTag,
                  state: states[atask.state - 4],
                  taskID:atask.tid
                }
                taskList.push(_atask)
              })
              resolve('ok')
            }
            resolve('null')
          }
        })
      }).then((res)=>{
        return new Promise((resolve,reject)=>{
          wx.request({
            url: 'https://www.wtysysu.cn:10443/v1//user/?' + 'userId=2',
            method: 'GET',
            header: {
              'accept': 'application/json'
            },
            success(res) {
              balance = res.data.balance
              resolve('ok')
            }
          })
        })
      }).then((res)=>{
        
        this.setData({
          taskList: taskList,
          isModifyTask: false,
          balance:balance,
          myPendingTasks: [],
          myDoingTasks: [],
          myFinishedTasks: [],
          currentPage: 0
        })
        console.log(res)
        console.log(taskList)

        this.preparePendingTasks()
        this.prepareDoingTasks()
        this.prepareFinishedTasks()
        this.setData({
          taskList: []
        })
        //加载完成
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
    }
    else if(this.data.selection==0){
      //刷新钱包
      let balance=0
      new Promise((resolve, reject) => {

        //获取账户余额

        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1//user/?' + 'userId=2',
          method: 'GET',
          header: {
            'accept': 'application/json'
          },
          success(res) {
            balance = res.data.balance
            resolve('ok')
          }
        })

      }).then((res) =>{
        console.log(balance)
        this.setData({
          balance:balance
        })
        wx.stopPullDownRefresh()
      })
      
    }
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    let taskList=this.data.taskList

    if (this.data.selection == 3) {
      wx.showNavigationBarLoading()
      //加载下一页
      new Promise((resolve, reject) => {
        console.log('GET /task/publisher')
        console.log('search_value: ' + this.data.search_value)
        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/task/publisher?page='+(this.data.currentPage+1)+'&keyword=' + this.data.search_value + '&userId=2',
          method: 'GET',
          header: {
            'accept': 'application/json'
          },
          success(res) {
            console.log(res)
            if (Array.isArray(res.data)) {
              res.data.forEach(function (atask) {
                let taskTag = atask.label.split(/\s+/)
                let imgURL = (atask.type == types[0]) ? "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg" : "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png"
                let _atask = {
                  taskReward: atask.reward,
                  taskInfo: atask.description,
                  taskName: (atask.type == types[0]) ? "问卷任务" : "跑腿任务",
                  imageURL: imgURL,
                  tags: taskTag,
                  state: states[atask.state - 4],
                  taskID: atask.tid,
                }
                taskList.push(_atask)
              })
              resolve('ok')
            }else{
              //无更多页
              wx.showToast({
                title: '无更多任务!',
                icon: 'none',
                duration: 2000,
              })
              resolve('null')
            }
            
          }
        })
      }).then((res) => {

        this.setData({
          taskList: taskList,
          currentPage: res == 'ok' ? this.data.currentPage + 1 : this.data.currentPage
        })
        console.log(res)

        this.preparePendingTasks()
        this.prepareDoingTasks()
        this.prepareFinishedTasks()
        this.setData({
          taskList: []
        })
        //加载完成
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
    } 
    else {
      wx.stopPullDownRefresh()
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})