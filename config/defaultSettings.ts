import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const colorList = [
  { key: 'daybreak', color: '#1890ff' },
  { key: 'dust', color: '#F5222D' },
  { key: 'volcano', color: '#FA541C' },
  { key: 'sunset', color: '#FAAD14' },
  { key: 'cyan', color: '#13C2C2' },
  { key: 'green', color: '#52C41A' },
  { key: 'geekblue', color: '#2F54EB' },
  { key: 'purple', color: '#722ED1' },
];

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: colorList[0].color,
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'UNSWIT学习社区',
  pwa: false,
  logo: '/img/logo.png',
  iconfontUrl: '',
  headerTheme: 'light',
  menu: {
    locale: true,
  },
};

export default Settings;
