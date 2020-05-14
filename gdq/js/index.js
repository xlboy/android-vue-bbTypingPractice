/*
				HintWord是获取词表的，会返回拿到的所有词
				countSize是计算码长的，计算码长前需要拿到获取到的词表
		*/
// var vConsole = new VConsole();
new Vue({
	el: '#app',
	data() {
		return {
			ckAry: [],
			textAry: [],
			textAry2: [], // 判断对错的
			sendText:{
				yesHint:[],
				noHint:[],
				domAry:[]
			},
			dealWithText: '',
			textarea: '', // 输入框
			startStrLength: 0,
			currentPageNum: 0, // 当前页
			onePageSize: 100, // 一页加载多少个字
			textareaLength: 0, // 上一段的长度，判断回改用
			isBlur: false, // 是否获取了焦点 
			llmc: '', //  理论码长
			tempStartTime: null, // 临时的开始时长,用来计算暂停了多少时间
			pauseTime: 0, // 暂停时长
			startTime: null, // 跟打开始的时间戳
			endTime: null, // 跟打结束的时间戳
			textNoom: '10', // 当前段数
			withStr: `人家就知道你不会离开我,哼唧唧`,
			currentWordHint: '', // 当前编码提示
			sszk: { // 实时速度 
				start: 0,
				hg: 0,
				zjs: '',
				sd: 0,
				mc: 0,
				jj: 0,
				previousBm: '',
				backSpace: 0,
				wordStr: ''
			},
			wordOptions: [], // 用户的词库 
			userInfo: { // 用户所有信息
				qq: 1,
				sign: '这个人很懒...什么都没有设置',
				userName: '',
				userId: '', // 用户的id
				currentWordId: '', // 当前选中的词库
			},
			regLoginDialog: false, // 注册登录的框
			regLoginForm: { // 登录时的框
				username: '',
				password: ''
			},
			wordAnalysisJson: {
				'全概': []
			},
			isShow: {
				isWordHint: false, // 控制词提显示
				isBindQQ: false, // 控制绑定QQ的窗口
				isSign: false, // 控制个签的窗口
				rigDrawer: false, // 右边设置的弹框
				isWordAnalysis: false,
			},

			loading: null, // 加载框 
			isReadTextWay: "2", // 读文方式,1为自动读，2为手动读
			bindQQStr: '', // 当前输入的QQ值
			signStr: '', //当前输入的个签
			pageStyle: {
				backOption: 70, // 背景透明度
				top: 'rgba(255, 255, 255, 0.7)',
				bottom: 'rgba(222, 222, 255, 0.7)'
			},
			avatarAddress: 'http://q1.qlogo.cn/g?b=qq&nk=52852983&s=640', // QQ头像接口
			// ip: `http://127.0.0.1:3000`
			ip: `http://xlboy.cn:8988` // 服务器的地址 http://xlboy.cn/bbService/readUserInfo
		}
	},
	methods: {
		async signSave() { // 个性签名设置
			axios.post(`${this.ip}/savaSign`, {
				userId: this.userInfo.userId,
				sign: this.signStr
			}).then(() => {
				this.toast('个签更改成功')
				this.isShow.isSign = false
				axios.post(`${this.ip}/readUserInfo`, {
					userId: this.userInfo.userId
				}).then((response) => {
					const data = response.data
					this.userInfo.userName = data.username
					this.userInfo.currentWordId = data.currentWordId
					this.userInfo.qq = data.qq
					this.userInfo.sign = data.sign === null || data.sign === '' ? '这个人很懒..什么都没有设置' : data.sign
					this.signStr = data.sign
					if (this.userInfo.qq !== null && this.userInfo.qq !== '') {
						this.avatarAddress = `http://q1.qlogo.cn/g?b=qq&nk=${this.userInfo.qq}&s=640`
					}
				})
			})
		},
		async bindQQ() { // 绑定QQ
			axios.post(`${this.ip}/savaQQ`, {
				userId: this.userInfo.userId,
				qq: this.bindQQStr
			}).then(() => {
				this.bindQQStr = ''
				this.isShow.isBindQQ = false
				this.readUserInfo()
			})
		},
		readWordHint(str) { // 拿词提
			return new Promise(resolve => {
				axios.post(`${this.ip}/queryWordHint`, {
					wordId: this.userInfo.currentWordId,
					str
				}).then((response) => {
					const data = response.data
					resolve(data)
				})
			})

		},
		login() { // 纯登录
			if (this.regLoginForm.username === '' || this.regLoginForm.password === '') return this.toast('不可为空啊，你妹的')

			axios.post(`${this.ip}/login`, {
				...this.regLoginForm
			}).then((response) => {
				const data = response.data
				if (data !== '账号密码有误') {
					this.toast('登录成功')
					localStorage.setItem('userId', data.id)
					this.userInfo.username = data.username
					this.userInfo.currentWordId = data.currentWordId
					this.userInfo.userId = data.id
					this.regLoginForm = { // 值给撸掉，一毛都不留，知道没
						username: '',
						password: ''
					}
					this.readStorageUserId() // 重新读一波用户的数据
					this.regLoginDialog = false
				} else {
					this.toast('账号密码有误')
				}
			})
		},
		logout() { // 注销
			this.$confirm('确认要注销吗..人家不想离开你?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => { // 重置一波信息
				this.toast('行,你无情,你冷漠,你抛弃我,我记住你了')
				localStorage.setItem('userId', '')
				this.wordOptions = []
				this.userInfo = {
					userName: '',
					userId: '', // 用户的id
					currentWordId: '' // 当前选中的词库
				}
			}).catch(() => {
				this.toast('哼,人家就知道你不会离开我,哼唧唧')
			});
		},
		regLogin() { // 注册并登录
			if (this.regLoginForm.username === '' || this.regLoginForm.password === '') return this.toast('不可为空啊，你妹的')
			axios.post(`${this.ip}/reg`, {
				...this.regLoginForm
			}).then((response) => {
				if (response.data !== '存在此账号') {
					this.toast('注册成功')
					this.regLoginForm = { // 值给撸掉，一毛都不留，知道没
						username: '',
						password: ''
					}
					localStorage.setItem('userId', response.data)
					this.readStorageUserId()
					this.regLoginDialog = false
				} else {
					this.toast('账户已存在')
				}
			})
		},
		wordUpdate(e) { // 修改用户词库
			this.userInfo.currentWordId = e
			this.start()
			axios.post(`${this.ip}/setUserWord`, {
					userId: this.userInfo.userId,
					wordId: e
				})
				.then((response) => {
					if (response.data === '更换词库成功') {
						this.toast('更换词库成功')
						this.regLoginDialog = false
					} else {
						this.toast('更换失败')
					}
				})
		},
		readUserInfo() { // 读取用户信息
			axios.post(`${this.ip}/readUserInfo`, {
				userId: this.userInfo.userId
			}).then((response) => {
				const data = response.data
				this.userInfo.userName = data.username
				this.userInfo.currentWordId = data.currentWordId
				this.userInfo.qq = data.qq
				this.userInfo.sign = data.sign === null || data.sign === '' ? '这个人很懒..什么都没有设置' : data.sign
				this.signStr = data.sign
				if (this.userInfo.qq !== null && this.userInfo.qq !== '') {
					this.avatarAddress = `http://q1.qlogo.cn/g?b=qq&nk=${this.userInfo.qq}&s=640`
				}
				this.start() // 用户信息读完后，再重新加载一遍词提
			})
		},
		readWordList() { // 读取词库
			let loading = this.getLoading()
			axios.post(`${this.ip}/readWord`, {
					userId: this.userInfo.userId
				})
				.then((response) => {
					loading.close()
					this.wordOptions = response.data
				})
		},
		toast(str) { // 弹出手机的弹框
			// androids.message(str)
		},
		setTextarea(str) { // 安卓打字数据传递到这里
			str = str.substr(0, this.withStr.length)
			this.dealWithText = str
		},
		getLoading() {
			let loading = this.$loading({
				lock: true,
				spinner: 'el-icon-loading',
				background: 'rgba(255,255,255, 0.8)'
			});
			return loading
		},
		wordAnalySort(e) { // 词提分析的
			const rule = [
				['bm4', 4, '4码四字词'],
				['bm2', 2, '二简词'],
				['bm3', 3, '三简词'],
				['bm4', 3, '4码三字词'],
				['bm4', 2, '4码二字词'],
				['bm3', 4, '3码四字词'],
				['bm3', 2, '3码二字词'],
				['bm2', 3, '2码三字词'],
				['bm2', 4, '2码四字词'],
			]

			if (e.hasOwnProperty('ys')) {
				this.wordAnalysisJson['全概'].push(e.val)
				const bmLength = [4, 3, 2, 1]
				bmLength.forEach(ee => {
					if (e.ys === `bm${ee}` && e.val.length > 4) {
						if (!this.wordAnalysisJson.hasOwnProperty(`${ee}码长词`)) this.wordAnalysisJson[`${ee}码长词`] = []
						this.wordAnalysisJson[`${ee}码长词`].push(e.val)
					}
					if (e.ys === `bm1` && e.val.length > 4) {
						if (!this.wordAnalysisJson.hasOwnProperty(`一简长词`)) this.wordAnalysisJson[`一简长词`] = []
						this.wordAnalysisJson[`一简长词`].push(e.val)
					} else if (e.ys === `bm1` && e.val.length === ee) {
						if (!this.wordAnalysisJson.hasOwnProperty(`一简${ee}字词`)) this.wordAnalysisJson[`一简${ee}字词`] = []
						this.wordAnalysisJson[`一简${ee}字词`].push(e.val)
					}
				})
				rule.forEach(ee => {
					if (e.ys === ee[0] && e.val.length === ee[1]) {
						if (!this.wordAnalysisJson.hasOwnProperty(ee[2])) this.wordAnalysisJson[ee[2]] = []
						this.wordAnalysisJson[ee[2]].push(e.val)
					}
				})
			} else if (/[\u4e00-\u9fa5]/g.test(e.val)) {
				if (!this.wordAnalysisJson.hasOwnProperty(`单字`)) this.wordAnalysisJson[`单字`] = []
				this.wordAnalysisJson[`单字`].push(e.val)
			} else {
				if (!this.wordAnalysisJson.hasOwnProperty(`符号`)) this.wordAnalysisJson[`符号`] = []
				this.wordAnalysisJson[`符号`].push(e.val)
			}
		},
		async sendArticle() { // 读文
			this.textarea = ""
			this.startTime = null
			this.currentPageNum = 0
			this.loading = this.getLoading()
			if (this.isReadTextWay === '1') {
				let pro = new Promise(async resolve => {
					this.withStr = androids.readText()
					this.withStr = this.withStr.replace(/\n/g,'')
					this.textNoom = androids.readNoom()
					if (this.withStr === '') { // 拿不到文
						resolve('啊哦..没读到文章..请确保窗口可视区域有文段内容')
					} else {
						await this.start()
						resolve('读文成功')
					}
				})
				pro.then((str) => {
					this.loading.close();
					this.toast(str)
				})
			} else {
				this.anew()
				const readText = async () => {
					const str = androids.readPasteText()
					let ary = str.split('-❤-❤-')
					if (ary.length === 1 || ary[0] === '') {
						this.loading.close();
						return this.toast('你复制的嘛玩意..!读取失败!')
					}
					this.loading.close();
					this.textNoom = ary[0]
					this.withStr = ary[1].replace(/\n/g,'')
					await this.start()
					
					this.toast('读文成功')
				}

				setTimeout(() => {
					readText()
				}, 600);
			}
		},
		countSd() { // 计算速度
			this.sszk.speed = (this.textarea.length / this.sszk.start * 60).toFixed(2) // 实时速度
			this.sszk.runningYard = (this.sszk.zjs.length / this.textarea.length).toFixed(2) // 实时码长
			this.sszk.keystroke = (this.sszk.zjs.length / this.sszk.start).toFixed(2) // 实时击键
		},
		hintWordMention() { // 词提遍历显示
			if(!this.isShow.isWordHint) return  // 如果没开启词提模式直接返回不让他执行下去
			this.ckAry.some(e => {
				const currentLength = this.textarea.length
				if (currentLength < e.jw && currentLength >= e.kt) {
					this.currentWordHint = e.bm
					return true
				}
				return false
			})
		},
		async start() { // 读取一波词提
				this.textarea = ''
				this.textAry2 = []
				this.sendText.yesHint = []
				this.sendText.noHint = []
				this.wordAnalysisJson = {
					'全概': []
				}
				this.withStr.split('').forEach((e,i)=>{
					this.textAry2.push({
						val: e,
						isCorret: null // 为null则是未输入，为true则是输入正确，false则是输入不正确
					})
					this.sendText.noHint.push({ // 不开词提的
						val:e,
						length:1,
						index:1,
						i_:i
					})
				})
				
				let data = await this.readWordHint(this.withStr)
				// 读一波词提
				this.ckAry = data.wordAry
				this.llmc = data.llmc
				let i = 0;
				this.ckAry.forEach((e, ii) => { // 来，泥马，跟哥横个看看？来啊，马勒戈壁
					this.textAry[ii] = []
					wordCount.judegOption(e)
					this.wordAnalySort(e)
					for (let i2 = 0; i2 < e.val.length; i2++) {
						let json = {
							index: this.ckAry[ii].kt,
							length: e.val.length,
							i_: i,
							...e
						}
						delete json.kt
						delete json.jw
						delete json.bm
						json.val = e.val[i2]
						this.sendText.yesHint.push(json)
						i++
					}

				})
				const wordAnaFun = () => { // 排序一波词提分析
					const wordSort = {
						'二简词': 1,
						'三简词': 2,
						'4码四字词': 3,
						'4码二字词': 4,
						'一简长词': 5,
						'一简2字词': 6,
						'一简3字词': 7,
						'一简4字词': 8,
						'4码长词': 9,
						'2码四字词': 10,
						'2码三字词': 11,
						'3码四字词': 12,
						'3码二字词': 13,
						'4码三字词': 14,
						'单字': 15,
						'符号': 16,
						'全概': 17,
					}
					let analyKeyAry = Object.keys(this.wordAnalysisJson)
					analyKeyAry.sort((e, i) => {
						return wordSort[e] - wordSort[i]
					})
					let lsAnaly = {
						...this.wordAnalysisJson
					}
					this.wordAnalysisJson = {}
					analyKeyAry.forEach(e => {
						this.wordAnalysisJson[e] = {
							...lsAnaly[e]
						}
					})
				}
				wordAnaFun() // 重新排序词提分析
		},
		typewriting(i) { // 获取焦点了的事件
			if (i === 1) androids.changeFlagFocus()
			else androids.changeFlagBoce()
		},
		startTextSize() { // 计算每页应该放多少字
			let gdk = document.getElementById('gdk')
			this.onePageSize = parseInt(gdk.offsetHeight / 35) * parseInt((gdk.offsetWidth - 20) / 20)
		},
		anew() { // 重打
			androids.textAnew()
			this.textarea = ""
			this.startStrLength = 0
			this.currentPageNum = 0
			this.$nextTick(()=>{
				this.withStr.split('').forEach((e,i)=>{
					let dom =document.getElementById(`gd_${i}`)
					if(dom === null || dom === undefined) return 
					dom.classList.remove('cw')
					dom.classList.remove('zq')
				})
			})
		},
		readStorageUserId() { // 初始化一波用户的信息 ,包括词库一类等等
			const userId = localStorage.getItem('userId') // 读取当前登录的用户名
			if (userId !== null && userId !== undefined && userId !== '' && userId !== 'undefined') { // 当拿到值，确认不是空先
				this.userInfo.userId = parseInt(userId)
				this.readUserInfo() // 读取用户的基础信息 // 这里面读到用户的信息后，还读了一遍载文
				this.readWordList() // 读取一波用户的词库 
			} else {
				this.start() // 重新加载一遍词提
			}
		},
		loginIptBlur(e) { // 登录框获取焦点的
			if (e === 2) androids.inputFocus()
			else androids.inputBlur()
		},
		readStronData() { // 读取一波本地的样式数据
			const backOption = localStorage.getItem('backOption') // 读透明度
			const pageTop = localStorage.getItem('pageTop') // 读透明度
			const pageBottom = localStorage.getItem('pageBottom') // 读透明度
			this.pageStyle.backOption = backOption !== null && backOption !== '' ? parseInt(backOption) : 70
			this.pageStyle.top = pageTop !== null && pageTop !== '' ? pageTop : 'rgba(255, 255, 255, 0.7)'
			this.pageStyle.bottom = pageBottom !== null && pageBottom !== '' ? pageBottom : 'rgba(222, 222, 255, 0.7)'
		},
		countErrorText(){ // 返回错字及错字后的时速
			let errorNum=0 
			let errorAry=[]
			this.textarea.split('').forEach((e, i) => { // 每改变一次文字，循环判断一遍是否输入正确
				const ee=this.withStr[i]
				if(e !== ee){
					errorNum++
					errorAry.push(`✘${e}✓${ee}`)
				}
			})
			if(errorNum===0) return '错字0'
			const countError=()=>{ // 计算出错字后的速度
				const withL=this.withStr.length
				const succeddSpeed= this.sszk.speed // 正确的速度
				const errorSpeed=((withL - (errorNum * 5)) / this.sszk.start * 60).toFixed(2)
				return `${errorSpeed}/${succeddSpeed}`
			}
			return [`错字${errorNum}[${errorAry.join(',')}]`,countError()]
		},
		verifCurrentIsYes(){ // 验证本页的对错
			this.$nextTick(()=>{
				this.withStr.slice(this.startStrLength,this.startStrLength+this.onePageSize).split('').forEach((e, i) => { // 每改变一次文字，循环判断一遍是否输入正确
					const index=this.startStrLength+i
					let dom = document.getElementById(`gd_${index}`)
					let isCorret = this.textAry2[index].isCorret
					if(dom === null || dom === undefined) return 
					dom.classList.remove('zq')
					dom.classList.remove('cw')
					if(isCorret===null) return 
					dom.classList.add(isCorret===true?'zq':'cw')
				})
			})
		},
		share(){ // 分享发文
			this.toast('分享成功')
			androids.changeFlagBoce()
			const withStr = this.withStr===''?'啊哦..啥文都没,不知分享啥':this.withStr
			const str = `${withStr}\n-----第${this.textNoom}段`
			androids.setPasteText(str)
			androids.sendMsgQQ(str)
		},
		paestText(str){
			let shareText = document.getElementById("shareText");
			shareText.value = str // 成绩
			shareText.select();
			document.execCommand("Copy")
		}
	},
	created() {
		this.readStorageUserId() // 初始化一波用户的信息 ,包括词库一类等等
		this.hintWordMention() // 折腾下提示

	},
	mounted() {
		this.readStronData() // 读一波背景透明度
		let _this = this
		window.setText = (msg) => { // 为了能让ANDROID调到VUE里的方法 
			_this.setTextarea(msg)
		}
		let onSize = setInterval(() => { // 大小不稳，需乱弄
			_this.startTextSize()
		}, 1000);
		window.onresize = () => {
			_this.startTextSize()
		}
		document.body.style.opacity = 1
	},
	watch: {
		['pageStyle.backOption']() {
			localStorage.setItem('backOption', this.pageStyle.backOption)
		},
		['pageStyle.top']() {
			localStorage.setItem('pageTop', this.pageStyle.top)
		},
		['pageStyle.bottom']() {
			localStorage.setItem('pageBottom', this.pageStyle.bottom)

		},
		['isShow.isWordHint'](){
			this.verifCurrentIsYes()
		},
		dealWithText() { // 计算击键、打词率、退格
			this.sszk.zjs += '-'
			const currentTextL = this.textarea.length - 1
			const ciLenth = this.dealWithText.substr(currentTextL + 1) // 当前打出的字符
			if (ciLenth === this.sszk.previousBm.substr(0, this.sszk.previousBm.length - 1)) this.sszk.backSpace += 1 // 计算退格
			if (/^[a-z]+$/g.test(ciLenth)) this.sszk.previousBm = ciLenth // 计算退格,上一个打的abc，下一个打的ab，通过这规律判断 
			if (this.withStr[currentTextL + 1] === this.dealWithText[currentTextL + 1]) { // 若打的字正确，直接射入
				if (ciLenth.length > 1) this.sszk.wordStr += ciLenth // 计算打词率
				this.textarea = this.dealWithText
			} else if (!/[a-z]/g.test(this.dealWithText.substr(currentTextL)) || ciLenth.length>4) { // 如果打的不正确，并且打的是英文以外的字符，就射入
				this.textarea = this.dealWithText
			}
		},
		onePageSize() { // 监听每页的字数为多少，如果为0则开始判断 
			let _this = this
			if (this.onePageSize === 0) {
				let onSize = setInterval(() => { // 大小不稳，需乱弄
					if (_this.onePageSize === 0) {
						_this.startTextSize()
					} else {
						clearInterval(onSize)
					}
				}, 1000);
			}
		},
		isBlur() { // 判断是否正在跟打
			if (this.textarea.length !== 0 && this.textarea.length !== this.withStr.length) {
				if (this.isBlur) {
					this.$message.success('继续跟打成功');
					if (this.tempStartTime !== null) this.pauseTime += (new Date().getTime() - this.tempStartTime)
				} else {
					this.$message.success('暂停跟打成功');
					this.tempStartTime = new Date().getTime()
				}
			}
		},
		withStr() {
			this.textarea = ''
		},
		startStrLength(){
			this.verifCurrentIsYes()
		},
		textarea() {
			let isPageAdd = false // 是否跳页了
			if (this.textarea.length >= this.startStrLength + this.onePageSize - 6) {
				this.currentPageNum++
				this.startStrLength = this.currentPageNum * this.onePageSize - (10 * this.currentPageNum)
			}
			this.textarea = this.textarea.substr(0, this.withStr.length)
			if (this.textarea.length < this.textareaLength) { // 回改了哦
				this.sszk.backChange++
				const kt = this.textarea.length
				for(i in '1'.repeat(10)){ // 这里也要修改下哈，泥马了个憋
					let dom =document.getElementById(`gd_${kt+parseInt(i)}`)
					if(dom!==undefined && dom!==null){
						dom.classList.remove('zq')
						dom.classList.remove('cw')
					}
				}
			}


			this.textAry2.forEach((e, i) => { // 将未输入的那部分转成黑色的字体
				if (i >= this.textarea.length) e.isCorret = null
			})
			this.textarea.slice(this.startStrLength,this.startStrLength+this.onePageSize).split('').forEach((e, i) => { // 每改变一次文字，循环判断一遍是否输入正确
				const index=this.startStrLength+i
				this.textAry2[index].isCorret = this.withStr[index] === e
				let isCorret = this.textAry2[index].isCorret
				let dom = document.getElementById(`gd_${index}`)
				dom.classList.remove('zq')
				dom.classList.remove('cw')
				if(isCorret===null) return 
				dom.classList.add(isCorret===true?'zq':'cw')
			})
			if (this.textarea.length === 0) { // 归零
				this.startTime = null
				this.anew()
				this.toast('听说你是重打王？')
				this.sszk = {
					start: 0,
					zjs: '',
					hg: 0,
					sd: 0,
					mc: 0,
					previousBm: '',
					backSpace: 0,
					jj: 0,
					wordStr: ''
				}
			}
			if (this.startTime === null || this.textareaLength === 0) { // 判断是不是刚开始打
				this.pauseTime = 0 // 如果是刚开始打,将记录暂停时间的变量恢复默认
				this.tempStartTime = null
				this.startTime = new Date().getTime() // 记录刚开始打的时间
			}
			if (this.textarea.length > 0) { // 开始跟打
				this.sszk.start = (new Date().getTime() - this.startTime - this.pauseTime) / 1000 // 当前所跟打了的时间 , 其中还减去了暂停的时间
				this.countSd()
			}


			if (this.textarea.length >= this.withStr.length && this.textarea[this.withStr.length - 1] === this.withStr[this.withStr.length - 1]) { // 跟打完成
				this.currentPageNum = 0
				this.textarea = this.textarea.substr(0, this.withStr.length)
				this.endTime = new Date().getTime()
				this.sszk.start = (this.endTime - this.startTime - this.pauseTime) / 1000
				this.countSd()
				this.startTime = null
				if (this.sszk.speed === 'Infinity' || this.sszk.speed === NaN || this.sszk.speed > 1000) {
					androids.changeFlagBoce()
					androids.sendMsgQQ(`我跟你们说哦，我家主人刚刚打出了神一般的速度，哇塞，每毫秒${this.sszk.speed}字呀！`)
					return this.toast('答应我，做个亻行吗，这特么光速都没这么快！')
				}
				const wordRate = (this.sszk.wordStr.length / this.withStr.length * 100).toFixed(2)
				const countTextSpeed=this.countErrorText()
				let str=``
				if(countTextSpeed!=='错字0'){
					str =`第${this.textNoom}段 速度${countTextSpeed[1]} 击键${this.sszk.keystroke} 码长${this.sszk.runningYard} 回改${this.sszk.backChange} 退格${this.sszk.backSpace} 理论码长${this.llmc} 打词${wordRate}% ${countTextSpeed[0]}[错1罚5] 字数${this.withStr.length} 耗时${this.sszk.start}s 个签:${this.userInfo.sign}   -BB打字机`
				}else{
					str =`第${this.textNoom}段 速度${this.sszk.speed} 击键${this.sszk.keystroke} 码长${this.sszk.runningYard} 回改${this.sszk.backChange} 退格${this.sszk.backSpace} 理论码长${this.llmc} 打词${wordRate}% 错字0 字数${this.withStr.length} 耗时${this.sszk.start}s 个签:${this.userInfo.sign}   -BB打字机`
				}
				androids.setPasteText(str)
				this.toast(str)
				androids.changeFlagBoce()
				androids.sendMsgQQ(str)
			}

			this.hintWordMention()

			this.textareaLength = this.textarea.length // 用来记录是否回改了
		}
	}
})
