<template>
  <div id="publish">
    <v-data-table :server-items-length="count" @update:options="optionsChange" :loading="formLoading" show-expand ref="dataTable" :page.sync="page"
                  v-model="selected" item-key="id"
                  loading-text="Loading..." multi-sort :headers="headers" :items="formData" show-select
                  :items-per-page="option.limit" class="elevation-1"
                  :footer-props="{showFirstLastPage: true,showCurrentPage:true}">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{$route.meta.title}}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical/>
          <v-spacer/>
          <v-btn depressed color="success" @click="downloadFiles">批量下载
            <v-icon right dark>mdi-cloud-download</v-icon>
          </v-btn>
          <v-btn depressed color="error" class="ml-3" @click="deleteItems">批量删除
            <v-icon right dark>mdi-delete</v-icon>
          </v-btn>
          <v-dialog v-model="dialogEdit" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2 ml-10" v-bind="attrs" v-on="on" v-if="false"> 新增数据</v-btn>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="搜索" single-line v-if="false"
                            hide-details></v-text-field>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">评价</span>
              </v-card-title>
              <v-card-text>
                <v-container fluid>
                  <v-row>
                    <v-col cols="12" style="display: flex;justify-content: space-between;">
                      <v-rating size="26" v-model="editForm['score']" background-color="orange lighten-3" color="orange"
                                length="4"/>
                      <v-btn color="orange lighten-1" text @click="editForm['score']=0"> 归零</v-btn>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea v-model="editForm.evaluate" label="回复内容" counter maxlength="100"
                                  outlined></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
                <div class="" style="display: flex;justify-content: left"></div>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn color="blue darken-1" text @click="closeEdit"> 取消</v-btn>
                <v-btn color="blue darken-1" text @click="save"> 保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">确认删除这条记录吗？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
                <v-btn color="error" type="" text @click="deleteItemConfirm">确定</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDeletes" max-width="500px">
            <v-card>
              <v-card-title class="headline">确认批量删除记录吗？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDeletes">取消</v-btn>
                <v-btn color="error" type="" text @click="deleteItemsConfirm">确定</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider/>
        <!--筛选搜索区-->
        <div class="w100 pl-3">
          <v-row>
            <v-col cols="auto">
              <v-text-field v-model="searchUsername" label="发布账号" clearable :filled="$notEmpty(searchUsername)" dense outlined
                            hide-details></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-text-field v-model="searchLocationRes" label="GPS位置" clearable :filled="$notEmpty(searchLocationRes)" dense outlined
                            hide-details></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="dates"
                      transition="scale-transition" offset-y min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="dateRangeText" label="发布日期" :filled="$notEmpty(dateRangeText)" clearable dense
                                outlined hide-details readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="dates" range no-title scrollable>
                  <v-spacer/>
                  <v-btn text color="primary" @click="menu = false"> 取消</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(dates)"> 确认</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="auto">
              <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :return-value.sync="dates2"
                      transition="scale-transition" offset-y min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="dateRangeText2" label="评价日期" clearable :filled="$notEmpty(dateRangeText2)"
                                dense outlined hide-details readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="dates2" range no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu2 = false"> 取消</v-btn>
                  <v-btn text color="primary" @click="$refs.menu2.save(dates2)"> 确认</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="auto" style="margin: auto 0">
              <v-range-slider hide-details max="4" min="-1" style="width: 250px" dense v-model="scoreRange" label="分数范围：">
                <template v-slot:thumb-label="props">{{props.value===-1?'无':props.value}}</template>
              </v-range-slider>
            </v-col>
            <v-col cols="auto" style="margin: auto 0">
              <span class="" style="color: #1867C0">总分数：<span style="font-weight: 500">{{score.sum}}</span></span>
              <span class="" style="color: #DC3232"> | 最高分：<span style="font-weight: 500">{{score.max}}</span></span>
              <span class="" style="color: #4CAF50"> | 最低分：<span style="font-weight: 500">{{score.min}}</span></span>
              <span class=""> | 平均分：<span style="font-weight: 500">{{score.avg}}</span></span>
              <span class=""> | 未评数：<span style="font-weight: 500">{{score.none}}</span></span>
            </v-col>
            <v-spacer/>
            <v-col cols="auto" class="mr-5">
              <v-btn depressed color="primary" @click="clearable" outlined>清空搜索条件</v-btn>
              <v-btn depressed color="primary" class="ml-3" @click="search">
                <v-icon left dark>mdi-magnify</v-icon>
                搜索
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-divider/>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon size="20" class="mr-2" @click="editItem(item)" title="评价" color="blue darken-1">mdi-pencil</v-icon>
        <v-icon size="20" class="mr-2" @click="downloadFile(item)" title="下载图片" color="success">mdi-download</v-icon>
        <v-icon size="20" @click="deleteItem(item)" title="删除" color="error"> mdi-delete</v-icon>
      </template>
      <template v-slot:[`item.userAvatar`]="{ item }">
        <v-avatar size="36">
          <img v-if="$notEmpty(item['user'])" :src="$addBaseURL(item.user['avatar'])">
        </v-avatar>
      </template>
      <template v-slot:[`item.username`]="{ item }">
        <span v-if="$notEmpty(item['user'])">{{item.user['username']}}</span>
      </template>
      <template v-slot:[`item.fileLength`]="{ item }">
        <span v-if="$notEmpty(item['file'])">{{item.file['length']}}</span>
      </template>
      <template v-slot:[`item.score`]="{ item }">
        {{item.score===-1?'未评分':item.score}}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <div class="" style="padding: 10px;width: 100%;display: flex;flex-direction: column">
            <div class="title" style="width: 100%" v-if="$notEmpty(item['title'])"><span>标题:</span><span> {{item['title']}}</span>
            </div>
            <div class="title" style="width: 100%" v-if="$notEmpty(item['content'])"><span>内容:</span><span> {{item['content']}}</span>
            </div>
            <div class="title" style="width: 100%" v-if="$notEmpty(item['evaluate'])"><span>回复:</span><span> {{item['evaluate']}}</span>
            </div>
            <div class="ip" style="width: 100%" v-if="$notEmpty(item['ip'])">
              <span>IP:</span><span> {{item['ip']}}</span></div>
            <div class="ipInfo" style="width: 100%" v-if="$notEmpty(item['ipInfo'])"><span>IP位置:</span><span> {{item.ipInfo['addr']}}</span>
            </div>
            <div class="locationResAddr" style="width: 100%" v-if="$notEmpty(item['locationResAddr'])"><span>GPS位置:</span>
              <span v-if="$notEmpty(item['locationResAddr'])">
                {{item['locationResAddr']}}
              </span>
            </div>
            <div class="title" style="width: 100%">
              <v-row v-if="$notEmpty(item['file'])" style="width: 100%">
                <v-col cols="4" v-for="item2 in item['file']" :key="item2.id"
                       style="font-weight: normal;font-size: 14px;line-height: 1.45;width: 100%;">
                  <div class=""
                       style="background-color: rgba(220,230,240,0.33);position: relative;width: 100%;max-width: 500px">
                    <v-img width="100%" height="auto" :src="$addBaseURL(item2['path'])"
                           @click="openImg($addBaseURL(item2['path']))" style="cursor: pointer"/>
                    <div v-if="$notEmpty(item2['name'])" style="width: 100%"><span>文件名:{{item2['name']}}</span></div>
                    <div v-if="$notEmpty(item2['size'])" style="width: 100%">
                      <span>文件大小:{{$sizeToStr(item2['size'])}}</span></div>
                    <div v-if="$notEmpty(item2['info']) && $notEmpty(item2['info']['imgInfo']) " style="width: 100%">
                      <div v-if="$notEmpty(item2['info']['imgInfo']['GPSLongitudeD'])"><span>经度:{{item2['info']['imgInfo']['GPSLongitudeD']}}</span>
                      </div>
                      <div v-if="$notEmpty(item2['info']['imgInfo']['GPSLatitudeD'])"><span>纬度:{{item2['info']['imgInfo']['GPSLatitudeD']}}</span>
                      </div>
                      <div v-if="$notEmpty(item2['info']['imgInfo']['FileDateTime'])"><span>拍摄时间:{{$formatDate(item2['info']['imgInfo']['FileDateTime']*1000)}}</span>
                      </div>
                      <div v-if="$notEmpty(item2['info']['imgInfo']['Model'])"><span>拍摄设备:{{item2['info']['imgInfo']['Model'] }}</span>
                      </div>
                      <div v-if="$notEmpty(item2['info']['imgInfo']['COMPUTED'])">
                        <div v-if="$notEmpty(item2['info']['imgInfo']['COMPUTED']['Width'])"><span>宽度:{{item2['info']['imgInfo']['COMPUTED']['Width']}}px</span>
                        </div>
                        <div v-if="$notEmpty(item2['info']['imgInfo']['COMPUTED']['Height'])"><span>高度:{{item2['info']['imgInfo']['COMPUTED']['Height']}}px</span>
                        </div>
                      </div>
                    </div>
                    <div style="display: flex;justify-content: flex-end;position: absolute;bottom: 0;right: 0;">
                      <v-btn color="success" small right @click="downloadPicture(item2,item)">下载文件
                        <v-icon right dark>mdi-cloud-download</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
        </td>
      </template>
      <template v-slot:no-data>暂无数据</template>
    </v-data-table>
  </div>
</template>

<script>

  import {
    delPublishApi,
    delPublishsApi,
    downloadFileApi,
    downloadFilesApi,
    getPublishApi,
    updatePublishApi
  } from "@/api/modules";
  import store from "@/store";
  import {axiosL} from "@/api/axios";

  export default {
    name: 'publish',
    computed: {
      dateRangeText: {
        get(){
          return this.dates.join(' ~ ')
        },
        set(){
          this.dates=[]
        }
      },
      dateRangeText2: {
        get(){
          return this.dates2.join(' ~ ')
        },
        set(){
          this.dates2=[]
        }
      },
    },
    data: () => ({
      lockGet:false,//获取锁
      dates: [],
      dates2: [],
      score:{min:0,max:0,sum:0,avg:0,none:0},
      scoreRange: [-1, 4],
      searchUsername: '',
      searchLocationRes: '',
      menu: false,
      menu2: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogDeletes: false,
      editedIndex: -1,
      selected: [],
      headers: [
        // { text: '标题', value: 'title'},
        // { text: '文案', value: 'content' },
        {text: 'ID', value: 'id', class: 'minWidth60'},
        // {text: '用户id', value: 'user.id', sortable: false,},
        {text: '账号', value: 'username', sortable: false, class: 'minWidth80'},
        {text: '头像', value: 'userAvatar', sortable: false, class: 'minWidth60'},
        {text: '图片数量', value: 'fileLength', sortable: false, class: 'minWidth80'},
        {text: 'GPS经纬度', value: 'location', class: 'minWidth80'},
        // {text: 'GPS地址', value: 'locationResAddr',class:'minWidth150'},
        // {text: 'IP', value: 'ip',class:'minWidth80'},
        // {text: 'IP位置', value: 'ipAddr',class:'minWidth150'},
        {text: '分数', value: 'score', class: 'minWidth80'},
        // {text: '状态', value: 'status'},
        {text: '发布时间', value: 'createTime', class: 'minWidth110'},
        {text: '评价时间', value: 'updateTime', class: 'minWidth110'},
        {text: '操作', value: 'actions', sortable: false, class: 'minWidth110'},
      ],
      formLoading: true,
      formData: [],
      count: 0,
      page:1,
      option: {
        page: 1,
        limit: 10,
        sortList: [{id: 'desc'}],
        searchList: []
      },
      editForm: {
        score: 0,
        evaluate: ''
      },
      editedItem: {},
      defaultItem: {},
    }),
    components: {},
    mounted() {
    },
    watch: {
      option: {
        handler() {
          this.getPublish()
        },
        deep: true
      },
      dialogEdit(val) {
        val || this.closeEdit()
      },
      dialogDelete(val) {
        val || this.closeDelete()
      },
      dialogDeletes(val) {
        val || this.closeDeletes()
      },
    },
    methods: {
      clearable() {
        this.dates = []
        this.dates2 = []
        this.scoreRange = [-1, 4]
        this.searchUsername = ''
        this.searchLocationRes = ''
      },
      search(){
        let temp = []
        //创建时间
        if (this.$notEmpty(this.dates)) {
          if (this.dates.length===2 && (this.$formatDate(this.dates[0],true) > this.$formatDate(this.dates[1],true)) ){
            this.dates = [this.dates[1],this.dates[0]]
          }
          let nextDay = this.$formatDate(this.$formatDate(this.dates[this.dates.length===2?1:0],true)+24*3600*1000,false,'YYYY-MM-DD')
          temp.push(['createTime','BETWEEN TIME',[this.dates[0],nextDay]])
        }
        //评分时间
        if (this.$notEmpty(this.dates2)) {
          if (this.dates2.length===2 && (this.$formatDate(this.dates2[0],true) > this.$formatDate(this.dates2[1],true)) ){
            this.dates2 = [this.dates2[1],this.dates2[0]]
          }
          let nextDay = this.$formatDate(this.$formatDate(this.dates2[this.dates2.length===2?1:0],true)+24*3600*1000,false,'YYYY-MM-DD')
          temp.push(['updateTime','BETWEEN TIME',[this.dates2[0],nextDay]])
        }
        if (this.$notEmpty(this.searchUsername)) temp.push(['user.username','=',this.searchUsername])
        if (this.$notEmpty(this.searchLocationRes)) temp.push(['locationResAddr','LIKE','%'+this.searchLocationRes+'%'])


        if (this.$notEmpty(this.scoreRange) && !(this.scoreRange[0]===-1&&this.scoreRange[1]===4)) {
          if (this.scoreRange[0]===this.scoreRange[1]){
            //指定某个分数
            temp.push(['score','=',this.scoreRange[0]])
          }else{
            temp.push(['score','BETWEEN',this.scoreRange])
          }
        }
        this.lockGet=true//恢复第一页先不获取
        this.page=1
        setTimeout(()=>{
          this.lockGet=false
          this.option.searchList=temp
        })
      },
      async downloadFile(item) {
        if (this.$notEmpty(item)) {
          //单个记录下载
          let res = await downloadFileApi(item.id).then(res => res).catch(err => err)
          if (res.status === 200) window.open(this.$addBaseURL(res.path))
        }
      },
      async downloadFiles() {
        let data = {
          ids: this.selected.map(item => item.id),
        }
        let res = await downloadFilesApi(data).then(res => res).catch(err => err)
        if (res.status === 200) window.open(this.$addBaseURL(res.path))
      },
      downloadPicture(item2, item) {
        let username = item.user ? item.user.username : ''
        let createTime = item.createTime.replace(/:/g, '-')
        let location = item.location
        axiosL(item2['path'], undefined, `${username + '_' + createTime + '_' + location + '_' + item['id'] + '_' + item2['id'] + '.' + item2['suffix']}`).then(res => res).catch(err => err)
      },
      openImg(url) {
        window.open(url)
      },
      optionsChange(v) {
        this.option.page = v.page;
        this.option.limit = v.itemsPerPage;
        this.option.sortList = [];
        v.sortBy.forEach((item, index) => {
          let obj = {};
          obj[item] = v.sortDesc[index] ? 'desc' : 'asc'
          this.option.sortList.push(obj)
        })
      },
      filter(value, search, item) {
        console.log(value, search, item);
      },
      editItem(item) {
        this.editedIndex = item['id']
        this.editForm.score = parseFloat(item['score']) ? parseFloat(item['score']) : 0
        this.editForm.evaluate = item['evaluate']
        this.editedItem = Object.assign({}, item)
        this.dialogEdit = true
      },
      deleteItem(item) {
        this.editedIndex = item['id']
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItems() {
        this.dialogDeletes = true
      },
      async deleteItemsConfirm() {
        this.formLoading = true;
        let data = {
          ids: this.selected.map(item => item.id),
        }
        let res = await delPublishsApi(data).then(res => res).catch(err => err).finally(() => {
          this.formLoading = false;
          this.getPublish();
        })
        if (this.$notEmpty(res['msg']) && this.$notEmpty(res['status']) && res['status'] === 200) {
          await store.dispatch('setMsg', {show: true, color: 'green', timeout: 5000, text: res['msg']})
          this.selected = []
        } else if (this.$notEmpty(res['msg'])) {
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: res['msg']})
        } else {
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: '发生未知错误'})
        }
        this.closeDeletes()
      },
      async deleteItemConfirm() {
        this.formLoading = true;
        let res = await delPublishApi(this.editedIndex).then(res => res).catch(err => err).finally(() => {
          this.formLoading = false;
          this.getPublish();
        })
        if (this.$notEmpty(res['msg']) && this.$notEmpty(res['status']) && res['status'] === 200) {
          await store.dispatch('setMsg', {show: true, color: 'green', timeout: 5000, text: res['msg']})
        } else if (this.$notEmpty(res['msg'])) {
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: res['msg']})
        } else {
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: '发生未知错误'})
        }
        this.closeDelete()
      },

      closeEdit() {
        this.dialogEdit = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDeletes() {
        this.dialogDeletes = false
      },
      async save() {
        this.formLoading = true;
        let res = await updatePublishApi(this.editedIndex, {...this.editForm}).then(res => res).catch(err => err).finally(() => {
          this.formLoading = false;
          this.getPublish();
        });
        if (this.$notEmpty(res['msg']) && this.$notEmpty(res['status']) && res['status'] === 200) {
          await store.dispatch('setMsg', {show: true, color: 'green', timeout: 5000, text: res['msg']})
        } else if (this.$notEmpty(res['msg'])) {
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: res['msg']})
        } else {
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: '发生未知错误'})
        }
        /*if (this.editedIndex > -1) {
          Object.assign(this.formData[this.editedIndex], this.editedItem)
        } else {
          this.formData.push(this.editedItem)
        }*/
        this.closeEdit()
      },
      getPublish() {
        if (!this.lockGet){
          let data = {...this.option}
          this.formLoading = true;
          getPublishApi(data).then(response => {
            this.formLoading = false
            if (response.status === 200) {
              this.formData = response['data']['list']
              this.count = response['data']['count']
              this.score = response['data']['score']
            }
          }).catch(() => {
            this.formLoading = false
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .minWidth60 {
    min-width: 60px;
  }

  .minWidth80 {
    min-width: 80px;
  }

  .minWidth90 {
    min-width: 90px;
  }

  .minWidth110 {
    min-width: 110px;
  }

  .minWidth120 {
    min-width: 120px;
  }

  .minWidth150 {
    min-width: 150px;
  }

  #publish {
  }
</style>
