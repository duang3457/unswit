import {GithubOutlined} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-layout';
import {PLANET_LINK} from "@/constants";

const Footer: React.FC = () => {
  const defaultMessage = 'UNSWIT出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'planet',
          title: '吐槽我们',
          href: PLANET_LINK,
          blankTarget: true,
        },
        {
          key: 'codeNav',
          title: '加入我们',
          href: 'https://www.code-nav.cn',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <><GithubOutlined/> GitHub</>,
          href: 'https://github.com/duang3457',
          blankTarget: true,
        },

      ]}
    />
  );
};

export default Footer;
