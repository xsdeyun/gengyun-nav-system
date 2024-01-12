<template>
  <div class="page-contanier">
    <div ref="pageHeader" class="page-header">
      <page-search
        v-model:value="search.value"
        @on-search="handleSearch()"
        @on-reset="resetSearch"
      >
        <n-tree-select
          class="w-xs mr-5"
          v-model:value="search.menu"
          placeholder="选择菜单"
          :options="menus"
          label-field="name"
          key-field="id"
        />
      </page-search>
    </div>
    <div class="page-content">
      <!-- table strat -->
      <page-table
        :data="table.data"
        :columns="columns"
        :loading="table.loading"
        @on-add="addFormData"
        @on-refresh="getPageData()"
        :pagination="true"
        :pageProps="pageProps"
        @on-updatePage="UpdatePageChange"
        :permission="{ action: 'nlinks:add' }"
      ></page-table>
      <!-- table end -->
    </div>
    <!-- model strat -->
    <page-model
      v-model:visible="modal.visible"
      :title="modal.title"
      @on-save="saveFormData"
    >
      <n-form
        ref="formRefs"
        label-placement="left"
        :label-width="80"
        :model="modal.form"
        :rules="modal.rules"
        :show-require-mark="true"
      >
        <n-form-item label="名称" path="name">
          <n-input v-model:value="modal.form.name" placeholder="输入名称" />
        </n-form-item>
        <n-form-item label="图标" path="icon">
          <n-input v-model:value="modal.form.icon" placeholder="输入链接图标" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input
            v-model:value="modal.form.description"
            type="textarea"
            placeholder="请输入描述"
          />
        </n-form-item>
        <n-form-item label="链接" path="link">
          <n-input v-model:value="modal.form.link" placeholder="输入链接地址" />
          <n-icon
            size="30"
            class="cursor-pointer m-l-5"
            color="#2d8cf0"
            @click="getFavicoData"
          >
            <LogoIonic />
          </n-icon>
        </n-form-item>
        <div class="flex">
          <n-form-item label="显示" path="state">
            <n-radio-group v-model:value="modal.form.state" name="left-size">
              <n-radio-button :value="0">否</n-radio-button>
              <n-radio-button :value="1">是</n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="排序" path="sort">
            <n-input-number v-model:value="modal.form.sort" />
          </n-form-item>
        </div>
        <div class="flex">
          <n-form-item label="浏览量" path="views">
            <n-input-number v-model:value="modal.form.views" />
          </n-form-item>
          <n-form-item label="收藏量" path="likes">
            <n-input-number v-model:value="modal.form.likes" />
          </n-form-item>
        </div>
        <n-form-item label="选择菜单" path="menu_id">
          <n-tree-select
            multiple
            :virtual-scroll="false"
            :options="menus"
            :default-value="modal.form.menu_id"
            label-field="name"
            key-field="id"
            @update:value="
              (e) => {
                modal.form.menu_id = e;
              }
            "
          />
        </n-form-item>
      </n-form>
    </page-model>
    <!-- model end -->
  </div>
</template>
<script setup>
import {
  reactive,
  h,
  onMounted,
  ref,
  withDirectives,
  resolveDirective,
} from "vue";
import { NSpace, NButton, NTag, NImage } from "naive-ui";
import { lList, lAdd, lEdit, lDelete, lFavicon } from "@/api/nav/links.js";
import { mList } from "@/api/nav/menus.js";
onMounted(() => {
  getPageData();
  getMenusData();
});
const menus = ref([]);
// search
const search = reactive({
  value: "",
  menu: "",
});
// page
const pageProps = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});
// 表格数据
const table = reactive({
  data: [],
  loading: false,
});
// 弹窗数据
const modal = reactive({
  title: "添加链接",
  visible: false,
  form: {
    name: "",
    icon: "",
    description: "",
    link: "",
    state: 1,
    sort: 100,
    views: 1000,
    likes: 1000,
    menu_id: 1,
  },
  rules: {
    name: [
      { required: true, message: "请输入名称！", trigger: ["input", "blur"] },
    ],
  },
});
// 表格字段
const columns = [
  {
    type: "selection",
    fixed: "left",
  },
  {
    title: "名称",
    key: "name",
  },
  {
    title: "描述",
    key: "description",
    ellipsis: true,
  },
  {
    title: "排序",
    key: "sort",
    resizable: true,
  },
  {
    title: "图标",
    key: "icon",
    render(row) {
      return h(NImage, { width: "40", src: row.icon }, {});
    },
  },
  {
    title: "显示",
    key: "state",
    render(row) {
      if (row.state == 0) {
        return h(
          NTag,
          { type: "error" },
          {
            default: () => "否",
          }
        );
      } else {
        return h(
          NTag,
          { type: "info" },
          {
            default: () => "是",
          }
        );
      }
    },
  },
  {
    title: "浏览量",
    key: "views",
  },
  {
    title: "收藏量",
    key: "likes",
  },
  {
    title: "添加时间",
    key: "create_time",
  },
  {
    title: "操作",
    key: "actions",
    width: "150",
    fixed: "right",
    render(row) {
        const permission = resolveDirective("permission");
      return h(
        NSpace,
        {},
        {
          default: () => [
            withDirectives(h(
              NButton,
              { size: "small",type:"primary", onClick: () => editRow(row) },
              { default: () => "编辑" }
            ),[[permission, { action: "nlinks:edit" }]]
            ),
            withDirectives(h(
              NButton,
              { size: "small", type: "error", onClick: () => deleteRow(row) },
              { default: () => "删除" }
            ),[[permission, { action: "nlinks:delete" }]]
            ),
          ],
        }
      );
    },
  },
];

// 获取页面数据
const getPageData = () => {
  table.loading = true;
  const params = {
    keyword: search.value,
    menu: search.menu,
    page: pageProps.page,
    pageSize: pageProps.pageSize,
  };
  lList(params).then((res) => {
    table.data = res.data.list.data;
    pageProps.total = res.data.list.total;
    table.loading = false;
  });
};
const handleSearch = () => {
  pageProps.page = 1;
  getPageData();
};
const resetSearch = () => {
  pageProps.page = 1;
  search.menu = "";
  getPageData();
};
const getMenusData = () => {
  mList().then((res) => {
    menus.value = res.data.list;
  });
};

const getFavicoData = () => {
  lFavicon({ url: modal.form.link }).then((res) => {
    const d = res.data;
    modal.form.name = d.title;
    modal.form.icon = d.ico_url;
    modal.form.description = d.description;
  });
};

// page update data
const UpdatePageChange = (a) => {
  pageProps.page = a.page;
  pageProps.pageSize = a.pageSize;
  getPageData();
};
const addFormData = () => {
  modal.title = "添加链接";
  modal.visible = true;
  modal.form = {
    name: "",
    icon: "",
    description: "",
    link: "",
    state: 1,
    sort: 100,
    views: 1000,
    likes: 1000,
    menu_id: 1,
  };
};
const formValidate = (o, callback) => {
  o.value?.validate((errors) => {
    if (!errors) {
      console.log("suc");
      callback && callback();
    } else {
      console.log(errors);
    }
  });
};
// 新增保存
const formRefs = ref(null);
const saveFormData = () => {
  formValidate(formRefs, addEditData());
};
// 新增编辑
const addEditData = async () => {
  const res = modal.form.id ? await lEdit(modal.form) : await lAdd(modal.form);
  if (res.code === 200) (modal.visible = false), getPageData();
  $message.success(res.message);
};

// 编辑行
const editRow = (row) => {
  modal.title = "修改链接";
  modal.visible = true;
  modal.form = Object.assign({}, row);
};
const deleteId = (row) => {
  lDelete({ id: row.id }).then((res) => {
    $message.success(res.message);
    getPageData();
  });
};
// 删除行
const deleteRow = (row) => {
  $dialog.confirm({
    title: "删除警告",
    content: "你确定要删除此链接吗？",
    confirm() {
      deleteId(row);
    },
    cancel() {
      $message.success("取消删除！");
    },
  });
};
</script>