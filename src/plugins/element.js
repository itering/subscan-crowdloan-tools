import Vue from "vue";
import {
  Autocomplete,
  Loading,
  MessageBox,
  Notification,
  Message,
  Button,
  DatePicker,
  TimeSelect,
  TimePicker,
  Drawer,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Scrollbar,
  Carousel,
  CarouselItem,
  Checkbox,
  CheckboxGroup,
  Col,
  Collapse,
  CollapseItem,
  // Carousel,
  // CarouselItem,
  // Breadcrumb,
  // BreadcrumbItem,
  InputNumber,
  Dialog,
  // Collapse,
  // CollapseItem,
  Icon,
  Input,
  Link,
  // Menu,
  // Submenu,
  // MenuItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Tooltip,
  // Pagination,
  Popover,
  Radio,
  RadioGroup,
  Row,
  Select,
  Switch,
  Option,
  Pagination,
  Progress,
  Upload
  // Badge
} from "element-ui";

// 按需引入element-ui的部分功能
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

Vue.use(Autocomplete);
Vue.use(Button);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Drawer);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Carousel);
Vue.use(CarouselItem);
// Vue.use(Breadcrumb)
// Vue.use(BreadcrumbItem)
Vue.use(InputNumber);
Vue.use(Dialog);
// Vue.use(Collapse)
// Vue.use(CollapseItem)
Vue.use(Icon);
Vue.use(Input);
Vue.use(Scrollbar);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Col);
Vue.use(Tooltip);
Vue.use(Link);
// Vue.use(Menu)
// Vue.use(Submenu)
// Vue.use(MenuItem)
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Popover);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Select);
Vue.use(Switch);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(Progress);
Vue.use(Row);
Vue.use(Upload);
