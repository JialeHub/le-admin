<template>
  <div id="user">
    <v-data-table :server-items-length="count" @update:options="optionsChange" :loading="formLoading"
                  loading-text="Loading..." multi-sort :search="search" :headers="headers" :items="formData"
                  :items-per-page="option.limit" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>用户</v-toolbar-title>
          <v-divider class="mx-4" inset vertical/>
          <v-spacer/>
          <v-dialog v-model="dialogEdit" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2 ml-10" v-bind="attrs" v-on="on" v-if="false"> 新增用户 </v-btn>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="搜索" single-line v-if="false"
                            hide-details></v-text-field>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">编辑</span>
              </v-card-title>
              <v-card-text>
                <div class="" style="display: flex;justify-content: center">
                  <v-btn @click="dialogResetPass=true">重置密码</v-btn>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeEdit"> 取消 </v-btn>
                <v-btn color="blue darken-1" text @click="save"> 保存 </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogResetPass" max-width="500px">
            <v-card>
              <v-card-title class="headline">确认重置该用户密码吗？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogResetPass=false">取消</v-btn>
                <v-btn color="error" type="" text @click="resetPassConfirm">确定</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">确认删除该用户吗？</v-card-title>
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
        <v-icon small @click="deleteItem(item)" v-if="false"> mdi-delete</v-icon>
      </template>
      <template v-slot:[`item.avatar`]="{ item }">
        <v-avatar size="36">
          <img :src="$addBaseURL(item['avatar'])" >
        </v-avatar>
      </template>
      <template v-slot:[`item.birthday`]="{ item }">
        {{$notEmpty(item['birthday'])? $formatDate(item['birthday'],false,'YYYY-MM-DD'):''}}
      </template>
      <template v-slot:[`item.gender`]="{ item }">
        <span v-if="item['gender']===0">保密</span>
        <span v-if="item['gender']===1">男</span>
        <span v-if="item['gender']===2">女</span>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <span v-if="item['status']===0">未激活</span>
        <span v-if="item['status']===1">正常</span>
        <span v-if="item['status']===2">禁用</span>
        <span v-if="item['status']===3">异常</span>
      </template>
      <template v-slot:no-data>暂无数据</template>
    </v-data-table>
  </div>
</template>

<script>

  import {delPublishApi, getUserListApi, updatePublishApi, updateUserApi} from "@/api/modules";
  import store from "@/store";
  import {RSAEncrypt} from "@/utils/cryptology";

  export default {
    name: 'user',
    components: {},
    data: () => ({
      dialogEdit: false,
      dialogDelete: false,
      dialogResetPass: false,
      editedIndex: -1,
      headers: [
        {text: 'ID', value: 'id',class:'minWidth60'},
        {text: '账号', value: 'username', class:'minWidth80'},
        {text: '头像', value: 'avatar', class:'minWidth80'},
        {text: '用户昵称', value: 'nickname', class:'minWidth80'},
        {text: '姓名', value: 'realname', class:'minWidth80'},
        {text: '生日', value: 'birthday', class:'minWidth80'},
        {text: '邮箱', value: 'email', class:'minWidth80'},
        {text: '性别', value: 'gender', class:'minWidth80'},
        {text: '手机', value: 'phone', class:'minWidth80'},
        {text: '介绍', value: 'profile', class:'minWidth80'},
        {text: '状态', value: 'status', class:'minWidth80'},
        {text: '创建时间', value: 'createTime',class:'minWidth110'},
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
        username: ''
      },
      editedItem: {},
      defaultItem: {},
    }),
    watch: {
      option: {
        handler() {
          this.getUserList()
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
      async resetPassConfirm(){
        this.formLoading = true;

        let res = await updateUserApi(this.editedIndex,{password:RSAEncrypt(this.editForm.username)}).then(res => res).catch(err => err).finally(() => {
          this.formLoading = false;
        })
        if (this.$notEmpty(res['msg']) && this.$notEmpty(res['status']) && res['status'] === 200) {
          await store.dispatch('setMsg', {show: true, color: 'green', timeout: 5000, text: res['msg']})
        }else if (this.$notEmpty(res['msg'])){
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: res['msg']})
        }else{
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: '发生未知错误'})
        }
        this.dialogResetPass=false
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
        this.editForm.username=item['username']
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
          this.getUserList();
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
          this.getUserList();
        });
        if (this.$notEmpty(res['msg']) && this.$notEmpty(res['status']) && res['status'] === 200) {
          await store.dispatch('setMsg', {show: true, color: 'green', timeout: 5000, text: res['msg']})
        }else if (this.$notEmpty(res['msg'])){
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: res['msg']})
        }else{
          await store.dispatch('setMsg', {show: true, color: 'deep-orange', timeout: 5000, text: '发生未知错误'})
        }
        this.closeEdit()
      },
      getUserList() {
        let data = {...this.option}
        this.formLoading = true;
        getUserListApi(data).then(response => {
          this.formLoading = false
          if (response.status === 200) {
            this.formData = response['list']
            this.count = response['count']
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
  #user {
  }
</style>
