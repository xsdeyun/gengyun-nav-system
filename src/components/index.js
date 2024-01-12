import PageSearch from './PageSearch/index.vue'
import PageDescribe from './PageDescribe/index.vue'
import PageTable from './PageTable/index.vue'
import PageModel from './PageModel/index.vue'
import UploadImage from './uploadImage/index.vue'




export function registerComponents(app) {
    app.component('page-search', PageSearch)
    app.component('page-describe', PageDescribe)
    app.component('page-table', PageTable)
    app.component('page-model', PageModel)
    app.component('upload-image', UploadImage)

}
