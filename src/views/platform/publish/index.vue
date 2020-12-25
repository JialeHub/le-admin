<template>
  <div id="publish">
    <v-data-table :server-items-length="count" @update:options="optionsChange" :loading="formLoading" show-expand
                  loading-text="Loading..." multi-sort :search="search" :headers="headers" :items="formData"
                  :items-per-page="option.limit" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>发布记录</v-toolbar-title>
          <v-divider class="mx-4" inset vertical/>
          <v-spacer/>
          <v-dialog v-model="dialogEdit" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2 ml-10" v-bind="attrs" v-on="on" v-if="false"> 新增数据</v-btn>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="搜索" single-line v-if="false"
                            hide-details></v-text-field>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">评分</span>
              </v-card-title>
              <v-card-text>
                <div class="" style="display: flex;justify-content: center">
                  <v-rating size="30" v-model="editForm['score']" background-color="orange lighten-3" color="orange" half-increments ></v-rating>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeEdit"> 取消 </v-btn>
                <v-btn color="blue darken-1" text @click="save"> 保存 </v-btn>
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
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete</v-icon>
      </template>
      <template v-slot:[`item.locationRes`]="{ item }">
        <span v-if="$notEmpty(item['locationRes'])">
          {{(item['locationRes']['country']?item['locationRes']['country']:'')+
          (item['locationRes']['province']?item['locationRes']['province']:'')+
          (item['locationRes']['city']?item['locationRes']['city']:'')+
          (item['locationRes']['district']?item['locationRes']['district']:'')+
          (item['locationRes']['street']?item['locationRes']['street']:'')+
          (item['locationRes']['streetNum']?item['locationRes']['streetNum']:'')+
          (item['locationRes']['poiName']?item['locationRes']['poiName']:'')}}
        </span>
      </template>
      <template v-slot:[`item.userAvatar`]="{ item }">
        <v-avatar size="36">
          <img v-if="$notEmpty(item['user'])" :src="$addBaseURL(item.user['avatar'])" >
        </v-avatar>
      </template>
      <template v-slot:[`item.username`]="{ item }">
        <span v-if="$notEmpty(item['user'])">{{item.user['username']}}</span>
      </template>
      <template v-slot:[`item.ipAddr`]="{ item }">
        <span v-if="$notEmpty(item['ipInfo'])">{{item.ipInfo['addr']}}</span>
      </template>
      <template v-slot:[`item.fileLength`]="{ item }">
        <span v-if="$notEmpty(item['file'])">{{item.file['length']}}</span>
      </template>
      <template v-slot:[`item.score`]="{ item }">
        {{$notEmpty(item.score)?item.score:'未评分'}}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <div class=""  style="padding: 10px;width: 100%;display: flex;flex-direction: column">
            <div class="title" style="width: 100%" v-if="$notEmpty(item['title'])"><span>标题:</span><span>{{item['title']}}</span></div>
            <div class="title" style="width: 100%" v-if="$notEmpty(item['content'])"><span>内容:</span><span>{{item['content']}}</span></div>
            <div class="title" style="width: 100%">
                <v-row v-if="$notEmpty(item['file'])">
                  <v-col cols="4" v-for="item2 in item['file']" :key="item2.id" style="font-weight: normal;font-size: 14px;line-height: 1.45;">
                    <div class="" style="background-color: rgba(220,230,240,0.33);">
                      <v-img width="100%" max-width="500" height="auto" :src="$addBaseURL(item2['path'])" @click="openImg($addBaseURL(item2['path']))" style="cursor: pointer"/>
                      <div v-if="$notEmpty(item2['name'])" style="width: 100%"><span>文件名:{{item2['name']}}</span></div>
                      <div v-if="$notEmpty(item2['size'])" style="width: 100%"><span>文件大小:{{$sizeToStr(item2['size'])}}</span></div>
                      <div v-if="$notEmpty(item2['info']) && $notEmpty(item2['info']['imgInfo']) " style="width: 100%">
                        <div v-if="$notEmpty(item2['info']['imgInfo']['GPSLongitudeD'])"><span>经度:{{item2['info']['imgInfo']['GPSLongitudeD']}}</span></div>
                        <div v-if="$notEmpty(item2['info']['imgInfo']['GPSLatitudeD'])"><span>纬度:{{item2['info']['imgInfo']['GPSLatitudeD']}}</span></div>
                        <div v-if="$notEmpty(item2['info']['imgInfo']['FileDateTime'])"><span>拍摄时间:{{$formatDate(item2['info']['imgInfo']['FileDateTime']*1000)}}</span></div>
                        <div v-if="$notEmpty(item2['info']['imgInfo']['Model'])"><span>拍摄设备:{{item2['info']['imgInfo']['Model'] }}</span></div>
                        <div v-if="$notEmpty(item2['info']['imgInfo']['COMPUTED'])">
                          <div v-if="$notEmpty(item2['info']['imgInfo']['COMPUTED']['Width'])"><span>宽度:{{item2['info']['imgInfo']['COMPUTED']['Width']}}px</span></div>
                          <div v-if="$notEmpty(item2['info']['imgInfo']['COMPUTED']['Height'])"><span>高度:{{item2['info']['imgInfo']['COMPUTED']['Height']}}px</span></div>
                        </div>
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

  import {delPublishApi, getPublishApi, updatePublishApi} from "@/api/modules";
  import store from "@/store";

  export default {
    name: 'publish',
    data: () => ({
      dialogEdit: false,
      dialogDelete: false,
      editedIndex: -1,
      headers: [
        // { text: '标题', value: 'title'},
        // { text: '文案', value: 'content' },
        {text: 'ID', value: 'id',class:'minWidth60'},
        // {text: '用户id', value: 'user.id', sortable: false,},
        {text: '账号', value: 'username', sortable: false,class:'minWidth80'},
        {text: '头像', value: 'userAvatar', sortable: false,class:'minWidth60'},
        {text: '图片数量', value: 'fileLength', sortable: false,class:'minWidth80'},
        {text: 'GPS经纬度', value: 'location',class:'minWidth80'},
        {text: 'GPS地址', value: 'locationRes',class:'minWidth150'},
        {text: 'IP', value: 'ip',class:'minWidth80'},
        {text: 'IP位置', value: 'ipAddr',class:'minWidth150'},
        {text: '分数', value: 'score',class:'minWidth80'},
        // {text: '状态', value: 'status'},
        {text: '发布时间', value: 'createTime',class:'minWidth110'},
        {text: '更新时间', value: 'updateTime',class:'minWidth110'},
        {text: '操作', value: 'actions', sortable: false,class:'minWidth90'},
      ],
      formLoading: true,
      formData: [],
      count: 0,
      search: '',
      option: {
        page: 1,
        limit: 10,
        sortList: [{id: 'desc'}],
        searchList: []
      },
      editForm:{
        score: 0
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
    },
    methods: {
      openImg(url){
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
        this.editForm.score=parseFloat(item['score'])
        this.editedItem = Object.assign({}, item)
        this.dialogEdit = true
      },
      deleteItem(item) {
        this.editedIndex = item['id']
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm() {
        this.formLoading = true;
        let res = await delPublishApi(this.editedIndex).then(res => res).catch(err => err).finally(() => {
          this.formLoading = false;
          this.getPublish();
        })
        if (this.$notEmpty(res['msg']) && this.$notEmpty(res['status']) && res['status'] === 200) {
          await store.dispatch('setMsg', {show: true, color: 'green', timeout: 5000, text: res['msg']})
        }else if (this.$notEmpty(res['msg'])){
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: res['msg']})
        }else{
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
      async save() {
        this.formLoading = true;
        let res = await updatePublishApi(this.editedIndex,{...this.editForm}).then(res=>res).catch(err=>err).finally(() => {
          this.formLoading = false;
          this.getPublish();
        });
        if (this.$notEmpty(res['msg']) && this.$notEmpty(res['status']) && res['status'] === 200) {
          await store.dispatch('setMsg', {show: true, color: 'green', timeout: 5000, text: res['msg']})
        }else if (this.$notEmpty(res['msg'])){
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: res['msg']})
        }else{
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
        let data = {...this.option}
        this.formLoading = true;
        getPublishApi(data).then(response => {
          this.formLoading = false
          if (response.status === 200) {
            this.formData = response['data']['list']
            this.count = response['data']['count']
          }
        }).catch(() => {
          this.formLoading = false
        })
      }
    }
  }
</script>

<style lang="scss">
  .minWidth60{
    min-width: 60px;
  }
  .minWidth80{
    min-width: 80px;
  }
  .minWidth90{
    min-width: 90px;
  }
  .minWidth110{
    min-width: 110px;
  }
  .minWidth120{
    min-width: 120px;
  }
  .minWidth150{
    min-width: 150px;
  }
  #publish {
  }
</style>
