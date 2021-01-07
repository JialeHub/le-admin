<template>
  <div id="collect">
    <v-data-table :server-items-length="count" @update:options="optionsChange" :loading="formLoading" ref="dataTable" :page.sync="page"  item-key="id"
                  loading-text="Loading..." multi-sort :headers="headers" :items="formData"
                  :items-per-page="option.limit" class="elevation-1"
                  :footer-props="{showFirstLastPage: true,showCurrentPage:true}">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{$route.meta.title}}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical/>
          <v-spacer/>
          <v-btn depressed color="warning" @click="collect">导出数据<v-icon right dark>mdi-cloud-download</v-icon></v-btn>
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
              <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="dates"
                      transition="scale-transition" offset-y min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="dateRangeText" label="用户发表日期" :filled="$notEmpty(dateRangeText)" clearable dense
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
            <v-spacer/>
            <v-col cols="auto" class="mr-5">
              <v-btn depressed color="primary" @click="clearable" outlined>清空搜索条件</v-btn>
              <v-btn depressed color="primary" class="ml-3" @click="search">
                <v-icon left dark>mdi-magnify</v-icon>
                筛选
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-divider/>
      </template>
      <template v-slot:[`item.avatar`]="{ item }">
        <v-avatar size="36">
          <img :src="$addBaseURL(item['avatar'])" alt="无">
        </v-avatar>
      </template>
      <template v-slot:[`item.username`]="{ item }">
        <span>{{item['username']}}</span>
      </template>
      <template v-slot:no-data>暂无数据</template>
    </v-data-table>
  </div>
</template>

<script>

  import {
    getCollectApi,
  } from "@/api/modules";

  export default {
    name: 'collect',
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
      searchUsername: '',
      menu: false,
      menu2: false,
      headers: [
        {text: '用户id', value: 'id', class: 'minWidth60'},
        {text: '账号', value: 'username', class: 'minWidth60'},
        {text: '头像', value: 'avatar', class: 'minWidth60'},
        {text: '总分', value: 'scoreSum', class: 'minWidth60'},
        {text: '最高分', value: 'scoreMax', class: 'minWidth60'},
        {text: '最低分', value: 'scoreMin', class: 'minWidth60'},
        {text: '平均分', value: 'scoreAvg', class: 'minWidth60'},
        {text: '已评数', value: 'scoreCount', class: 'minWidth60'},
        {text: '未评数', value: 'scoreNone', class: 'minWidth60'},
        {text: '发表数', value: 'publishCount', class: 'minWidth60'},
        {text: '注册时间', value: 'createTime', class: 'minWidth110'},
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
      defaultItem: {},
    }),
    components: {},
    mounted() {
    },
    watch: {
      option: {
        handler() {
          this.getCollect()
        },
        deep: true
      },
    },
    methods: {
      getCollect(){
        if (!this.lockGet){
          let data = {...this.option}
          this.formLoading = true;
          getCollectApi(data).then(response => {
            this.formLoading = false
            if (response.status === 200) {
              this.formData = response['data']['list']
              this.count = response['data']['count']
            }
          }).catch(() => {
            this.formLoading = false
          })
        }
      },
      clearable() {
        this.dates = []
        this.dates2 = []
        this.searchUsername = ''
      },
      search(){
        let temp = []
        //创建时间
        if (this.$notEmpty(this.dates)) {
          if (this.dates.length===2 && (this.$formatDate(this.dates[0],true) > this.$formatDate(this.dates[1],true)) ){
            this.dates = [this.dates[1],this.dates[0]]
          }
          let nextDay = this.$formatDate(this.$formatDate(this.dates[this.dates.length===2?1:0],true)+24*3600*1000,false,'YYYY-MM-DD')
          temp.push(['publish.createTime','BETWEEN TIME',[this.dates[0],nextDay]])
        }
        //评分时间
        if (this.$notEmpty(this.dates2)) {
          if (this.dates2.length===2 && (this.$formatDate(this.dates2[0],true) > this.$formatDate(this.dates2[1],true)) ){
            this.dates2 = [this.dates2[1],this.dates2[0]]
          }
          let nextDay = this.$formatDate(this.$formatDate(this.dates2[this.dates2.length===2?1:0],true)+24*3600*1000,false,'YYYY-MM-DD')
          temp.push(['publish.updateTime','BETWEEN TIME',[this.dates2[0],nextDay]])
        }
        if (this.$notEmpty(this.searchUsername)) temp.push(['username','=',this.searchUsername])

        this.lockGet=true//恢复第一页先不获取
        this.page=1
        setTimeout(()=>{
          this.lockGet=false
          this.option.searchList=temp
        })
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

  #collect {
  }
</style>
