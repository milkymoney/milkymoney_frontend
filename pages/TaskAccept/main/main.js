// pages/TaskAccept/main/main.js
var states=['pending','doing','checking','other']
var types = ['questionnaire', 'errand']


Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_value_main:'',
    search_value_personal: '',

    selection: 0,
    active: 0,
    location_city:'广州',
    taskList:[],
    //找任务筛选显示
    seletcedTaskList:[],

    //msgNumber表示个人信息通知数量
    msgNumber:0,

    show: {
      middle: false,
      top: false,
      bottom: false,
      right: false,
      right2: false
    },
    areas: ["所有",'广州', "深圳", "佛山", "东莞", "珠海", "澳门", "香港", "中山"],
    taskType:["不限类型","问卷调研","跑腿服务"],
    sortOrder:["不限排序","最新发布","离我最近","报酬最高"],

    areaSelected:'所有',
    taskTypeSelected:'不限类型',
    sortOrderSelected:'不限排序',

    selectedToogle:'areas',
    selectedInfo:'所有 不限类型 不限排序',
    
    //记录当前的page页数
    currentTaskListPage:0,
    currentMyTasksPage:0,
    
    myPendingTasks:[],
    myDoingTasks:[],
    myCheckingTasks:[],
    myOtherTasks:[],

    //用来缓存未被加入PendingTasks DoingTasks等的task
    myTasksTemp:[],

    userInfo:null
  },

  /**
   * 任务详情跳转函数
   */
  navToTaskDetail(event) {
    //console.log(event)
    console.log('navToTaskDetail')
    console.log(this.data.myDoingTasks)
    let selectedTask = {}
    
    if(this.data.selection==3){
      this.data.myPendingTasks.forEach(function (atask) {
        if (atask.taskID == event.target.id) {
          selectedTask = atask
        }
      })
      this.data.myDoingTasks.forEach(function (atask) {
        if (atask.taskID == event.target.id) {
          selectedTask = atask
        }
      })
      this.data.myCheckingTasks.forEach(function (atask) {
        if (atask.taskID == event.target.id) {
          selectedTask = atask
        }
      })
      this.data.myOtherTasks.forEach(function (atask) {
        if (atask.taskID == event.target.id) {
          selectedTask = atask
        }
      })
    }else{
      this.data.taskList.forEach(function (atask) {
        if (atask.taskID == event.target.id) {
          selectedTask = atask
        }
      })
    }

    

    console.log(selectedTask)
    if (Array.isArray(selectedTask.tags)){
      selectedTask.tags = selectedTask.tags.join(' ')
    }

    wx.navigateTo({
      url: '../task_datail/task_detail?taskID=' + selectedTask.taskID 
                      + '&state=' + selectedTask.state 
                      + '&tags=' + selectedTask.tags 
                      + '&taskReward=' + selectedTask.taskReward
                      + '&taskInfo=' + selectedTask.taskInfo
                      + '&taskName=' + selectedTask.taskName
                      + '&type=' + selectedTask.type
    })
  },

  /**
   * 底部弹出选择
   */
  onTransitionEnd() {
    //console.log(`You can't see me 🌚`);
  },
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type],
      selectedInfo:this.data.areaSelected+" "+this.data.taskTypeSelected+" "+this.data.sortOrderSelected,
    });
  },

  toggleBottomPopup(){
    this.toggle('bottom');
  },

  toggleBottomPopupArea() {
    this.toggle('bottom');
    this.setData({
      selectedToogle:'areas'
    })
  },
  
  toggleBottomPopupTaskType() {
    this.toggle('bottom');
    this.setData({
      selectedToogle:'taskType'
    })
  },

  toggleBottomPopupSortOrder() {
    this.toggle('bottom');
    this.setData({
      selectedToogle:'sortOrder'
    })
  },


  onCancel() {
    this.toggleBottomPopup()
  },

  onConfirmArea(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      areaSelected:value,
      
    })
    console.log("onConfirmArea:" + this.data.areaSelected)
    this.toggleBottomPopup()
    this.selectTaskBasedOnSelectedInfo()
  },
  
  onConfirmTaskType(event) {
    const { picker, value, index } = event.detail;
    
    console.log("onConfirmTaskType:"+this.data.taskTypeSelected);
    this.setData({
      taskTypeSelected: value
    });
    this.toggleBottomPopup()

    
    let taskList = []

    //对于taskList选择
    if (this.data.taskTypeSelected == "不限类型") {
      taskList = this.data.taskList

    } else if (this.data.taskTypeSelected == "问卷调研") {

      this.data.taskList.forEach(function (task) {
        if (task.type == types[0]) {
          //问卷
          taskList.push(task)
        }
      })

    } else if (this.data.taskTypeSelected == "跑腿服务") {
      this.data.taskList.forEach(function (task) {
        if (task.type == types[1]) {
          //跑腿
          taskList.push(task)
        }
      })
    }
    this.setData({
      seletcedTaskList: taskList
    })
    this.selectTaskBasedOnSelectedInfo()
  },

  onConfirmSortOrder(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      sortOrderSelected: value
    });
    console.log("onConfirmSortOrder:"+this.data.sortOrderSelected)
    this.toggleBottomPopup()
    this.selectTaskBasedOnSelectedInfo()
  },
  
  /**
   * 根据筛选标准排序 
   */
  selectTaskBasedOnSelectedInfo(){
    
    if(this.data.seletcedTaskList.length==0){
      this.setData({
        seletcedTaskList: this.data.taskList
      })
    }
    
    
    //对上面的进行排序
    if (this.data.sortOrderSelected =='最新发布'){

    } else if (this.data.sortOrderSelected == '离我最近'){
      
    } else if (this.data.sortOrderSelected == '报酬最高'){
      let len=this.data.seletcedTaskList.length
      for (let i=0;i<len;i++){
        console.log(this.data.seletcedTaskList[i].taskReward)
        for (let j=0;j<len;j++){
          if (this.data.seletcedTaskList[i].taskReward 
          > this.data.seletcedTaskList[j].taskReward ){
            let temp = this.data.seletcedTaskList[i]
            this.data.seletcedTaskList[i] = this.data.seletcedTaskList[j]
            this.data.seletcedTaskList[j]=temp
          }
        }
      }
    }else{
      //无需排序

    }
    this.setData({
      seletcedTaskList: this.data.seletcedTaskList
    })
  },

  /**
   * 底部页面选择
   */
  onChange: function (event) {
    this.setData({
      selection: event.detail,
      active: event.detail
    });

    //跳转到发布任务界面
    if (this.data.selection == 2) {
      wx.redirectTo({
        url: '../../TaskRelease/main/main',
      })
    } else if (this.data.selection == 0 || this.data.selection == 1) {
      this.onPullDownRefresh()
    } else if (this.data.selection == 3) {
      this.onPullDownRefresh()
    }

  },

  /**
   * 搜索函数
   */
  onChangeMain(event){
    this.setData({
      search_value_main:event.detail
    })
  },

  onSearchMain(){
    console.log("onSearchMain:"+this.data.search_value_main)
    let _taskList = []

    //将获取到的所有已发布任务装入_taskList

    new Promise((resolve, reject) => {
      console.log('GET /task')

      wx.request({
        url: 'https://www.wtysysu.cn:10443/v1/task?page=0&keyword=' + this.data.search_value_main + '&userId=2',
        method: 'GET',
        header: {
          'accept': 'application/json'
        },
        success(res) {
          if (Array.isArray(res.data)&&res.data.length>0) {
            console.log(res.data)
            res.data.forEach(function (atask) {
              let taskTag = atask.label.split(" ")
              let imgURL = (atask.type == types[0]) ? "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg" : "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png"
              let _atask = {
                taskReward: atask.reward,
                taskInfo: atask.description,
                type: atask.type,
                taskName: (atask.type == types[0]) ? "问卷任务" : "跑腿任务",
                imageURL: imgURL,
                tags: taskTag,
                taskID: atask.tid
              }
              _taskList.push(_atask)
            })
            resolve('ok')
          }else{
            resolve('null')
          }
          
        }
      })
    }).then((res) => {
      if(res=='ok'){
        wx.showToast({
          title: '搜索成功',
          icon: 'success',
          duration: 2000,
        })
      }else{
        wx.showToast({
          title: '无相关内容',
          icon: 'none',
          duration: 2000,
        })
      }
      
      this.setData({
        taskList: _taskList,
        currentTaskListPage: 0,


      })

      console.log(_taskList)

    })

    this.selectTaskBasedOnSelectedInfo()
    
  },

  /*暂时不用
  onChangePersonalTask(event){
    this.setData({
      search_value_personal: event.detail
    })
  },

  onSearchPersonalTask(){
    //console.log("onSearchPersonalTask:" + this.data.search_value_personal)
    
  },*/

  /**
   * 切换任务袋的tab
   */
  onChangeTab(event){
    

  },
  preparePendingTasks(){
    let listTemp = this.data.myPendingTasks
    this.data.myTasksTemp.forEach(task => {
      if (task.state == states[0]) {
        listTemp.push(task)
        this.setData({
          myPendingTasks: listTemp
        })
      }
    })
  },
  prepareDoingTasks() {
    let listTemp = this.data.myDoingTasks
    this.data.myTasksTemp.forEach(task => {
      if (task.state == states[1]) {
        listTemp.push(task)
        this.setData({
          myDoingTasks: listTemp
        })
      }
    })
  },
  prepareCheckingTasks() {
    let listTemp = this.data.myCheckingTasks
    this.data.myTasksTemp.forEach(task => {
      if (task.state == states[2]) {
        listTemp.push(task)
        this.setData({
          myCheckingTasks: listTemp
        })
      }
    })
  },
  prepareOtherTasks() {
    let listTemp = this.data.myOtherTasks
    this.data.myTasksTemp.forEach(task => {
      if (task.state == states[3]) {
        listTemp.push(task)
        this.setData({
          myOtherTasks: listTemp
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   * 将获取到的任务push进taskListPre
   */
  onLoad: function (options) {
    if (options.selection != null) {
      this.setData({
        selection: options.selection,
        active: options.selection
      })
      this.onPullDownRefresh()
    }
    let taskListPre = this.data.taskList

    //将获取到的任务push进taskListPre
    let taskPromise = new Promise((resolve, reject) => {
      console.log('GET /task')
      console.log('search main value: ' + this.data.search_value_main)
      wx.request({
        url: 'https://www.wtysysu.cn:10443/v1/task?page=0&keyword=' + this.data.search_value_main + '&userId=2',
        method: 'GET',
        header: {
          'accept': 'application/json'
        },
        success(res) {
          console.log(res)
          if (Array.isArray(res.data)&&res.data.length>0){
            res.data.forEach(function (atask) {
              
              let taskTag = atask.label.split(" ")
              let imgURL = (atask.type == types[0]) ? "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg" : "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png"
              let _atask = {
                taskReward: atask.reward,
                taskInfo: atask.description,
                type: atask.type,
                taskName: (atask.type == types[0]) ? "问卷任务" : "跑腿任务",
                imageURL: imgURL,
                state: atask.state,
                tags: taskTag,
                taskID: atask.tid
              }
              taskListPre.push(_atask)
            })
            resolve('ok')
          }else{
            resolve('null')
          }
          
        }
          
          
      })
    })

    taskPromise.then((res) =>{
      if (res == 'null') {
        wx.showToast({
          title: '无相关内容',
          icon: 'none',
          duration: 2000,
        })
      }
      
      this.setData({
        taskList: taskListPre,
        userInfo: getApp().globalData.userInfo,
        myTasksTemp: taskListPre,
        myPendingTasks: [],
        myDoingTasks: [],
        myCheckingTasks: [],
        myOtherTasks: []
      })

      console.log(taskListPre)

      this.preparePendingTasks()
      this.prepareDoingTasks()
      this.prepareCheckingTasks()
      this.prepareOtherTasks()

      this.setData({
        myTasksTemp:[]
      })
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
    //在标题栏中显示加载
    wx.showNavigationBarLoading()
    //这里增加刷新函数
    if(this.data.selection==0||this.data.selection==1){
      //下拉刷新所有的可见已发布任务
      let _taskList=[]

      //将获取到的所有已发布任务装入_taskList

      new Promise( (resolve,reject)=>{
        console.log('GET /task')
        console.log('keyword',this.data.search_value_main)
        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/task?page=0&keyword=' + this.data.search_value_main + '&userId=2',
          method: 'GET',
          header: {
            'accept': 'application/json'
          },
          success(res) {
            if (Array.isArray(res.data)&&res.data.length>0) {
              console.log(res.data)
              res.data.forEach(function (atask) {
                let taskTag = atask.label.split(" ")
                let imgURL = (atask.type == types[0]) ? "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg" : "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png"
                let _atask = {
                  taskReward: atask.reward,
                  taskInfo: atask.description,
                  type: atask.type,
                  taskName: (atask.type == types[0]) ? "问卷任务" : "跑腿任务",
                  imageURL: imgURL,
                  tags: taskTag,
                  taskID: atask.tid
                }
                _taskList.push(_atask)
              })
              resolve('ok')
            }else{
              resolve('null')
            }
            
          }
        })
      } ).then( (res)=>{
        if (res == 'null') {
          wx.showToast({
            title: '无相关内容',
            icon: 'none',
            duration: 2000,
          })
        }
        this.setData({
          taskList: _taskList,
          currentTaskListPage: 0,
          

        })

        console.log(res)
        console.log(_taskList)

      } )

    }else if(this.data.selection==3){
      //下拉刷新自己已接受的任务袋
      let _myTasks=[]

      //将获取到的自己接收到的放入_myTasks

      new Promise((resolve,reject)=>{
        console.log('GET /task/recipient')
        console.log('search value personal: ' + this.data.search_value_personal)
        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/task/recipient?page=0&keyword=' + this.data.search_value_personal + '&userId=3',
          method: 'GET',
          header: {
            'accept': 'application/json'
          },
          success(res) {
            console.log(res)
            if (Array.isArray(res.data)){
              res.data.forEach(function (atask) {
                let taskTag = atask.label.split(" ")
                let imgURL = (atask.type == types[0]) ? "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg" : "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png"
                let _atask = {
                  taskReward: atask.reward,
                  taskInfo: atask.description,
                  type: atask.type,
                  taskName: (atask.type == types[0]) ? "问卷任务" : "跑腿任务",
                  imageURL: imgURL,
                  tags: taskTag,
                  state: states[atask.state],
                  taskID: atask.tid
                }
                _myTasks.push(_atask)
              })
              resolve('ok')
            }
            resolve('null')
            
          }
        })
      }).then( (resolve)=>{
     
        this.setData({
          taskList: _myTasks,
          myTasksTemp: _myTasks,
          myPendingTasks: [],
          myDoingTasks: [],
          myCheckingTasks: [],
          myOtherTasks: [],
          currentMyTasksPage: 0,
        })
        console.log(resolve)
        console.log(_myTasks)

        this.preparePendingTasks()
        this.prepareDoingTasks()
        this.prepareCheckingTasks()
        this.prepareOtherTasks()

        this.setData({
          myTasksTemp: []
        })
      } )

      

    }

    //加载完成
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    //在标题栏中显示加载
    wx.showNavigationBarLoading()
    //这里增加刷新函数
    if (this.data.selection == 0 || this.data.selection == 1) {
      //下拉刷新所有的可见已发布任务
      let _taskList = this.data.taskList

      //将获取到的所有已发布任务装入_taskList

      new Promise((resolve, reject) => {
        console.log('GET /task')

        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/task?page='+(this.data.currentTaskListPage+1)+'&keyword=' + this.data.search_value_main + '&userId=2',
          method: 'GET',
          header: {
            'accept': 'application/json'
          },
          success(res) {
            if (Array.isArray(res.data) && res.data.length>0) {
              console.log(res.data)
              res.data.forEach(function (atask) {
                let taskTag = atask.label.split(" ")
                let imgURL = (atask.type == types[0]) ? "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg" : "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png"
                let _atask = {
                  taskReward: atask.reward,
                  taskInfo: atask.description,
                  type: atask.type,
                  taskName: (atask.type == types[0]) ? "问卷任务" : "跑腿任务",
                  imageURL: imgURL,
                  tags: taskTag,
                  taskID: atask.tid
                }
                _taskList.push(_atask)
              })
              resolve('ok')
            }else{
              resolve('null')
            }
            
          }
        })
      }).then((res) => {
        
        this.setData({
          taskList: _taskList,
          currentTaskListPage: res == 'ok' ? this.data.currentTaskListPage + 1 : this.data.currentTaskListPage
        })
        console.log(res)
        if(res=='null'){
          wx.showToast({
            title: '无更多任务!',
            icon: 'none',
            duration: 2000,
          })
        }

        console.log(_taskList)

      })

    } else if (this.data.selection == 3) {
      //下拉刷新自己已接受的任务袋
      let _myTasks = this.data.myTasksTemp

      //将获取到的自己接收到的放入_myTasks

      let taskPromise = new Promise((resolve, reject) => {
        console.log('GET /task/recipient')
        console.log('search value personal: ' + this.data.search_value_personal)
        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/task/recipient?page='+(this.data.currentMyTasksPage+1)+'&keyword=' + this.data.search_value_personal + '&userId=3',
          method: 'GET',
          header: {
            'accept': 'application/json'
          },
          success(res) {
            console.log(res)
            if (Array.isArray(res.data)&&res.data.length>0) {
              res.data.forEach(function (atask) {
                let taskTag = atask.label.split(" ")
                let imgURL = (atask.type == types[0]) ? "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg" : "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png"
                let _atask = {
                  taskReward: atask.reward,
                  taskInfo: atask.description,
                  type: atask.type,
                  taskName: (atask.type == types[0]) ? "问卷任务" : "跑腿任务",
                  imageURL: imgURL,
                  tags: taskTag,
                  state: states[atask.state],
                  taskID: atask.tid
                }
                _myTasks.push(_atask)
              })
              resolve('ok')
            }else{
              resolve('null')
            }
            

          }
        })
      })

      taskPromise.then((res) => {

        this.setData({
          
          myTasksTemp: _myTasks,
          currentMyTasksPage:res=='ok'?this.data.currentMyTasksPage+1:this.data.currentMyTasksPage
        })
        if (res == 'null') {
          wx.showToast({
            title: '无更多任务!',
            icon: 'none',
            duration: 2000,
          })
        }
        

        this.preparePendingTasks()
        this.prepareDoingTasks()
        this.prepareCheckingTasks()
        this.prepareOtherTasks()

        this.setData({
          myTasksTemp: [],

        })
      })

    }

    //加载完成
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})