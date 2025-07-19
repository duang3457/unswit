import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
import { COMPLAINT_LINK, JOIN_US_LINK, GITHUB_LINK } from '@/constants';

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
          href: COMPLAINT_LINK,
          blankTarget: true,
        },
        {
          key: 'codeNav',
          title: '加入我们',
          href: JOIN_US_LINK,
          blankTarget: true,
        },
        {
          key: 'github',
          title: (
            <>
              <GithubOutlined /> GitHub
            </>
          ),
          href: GITHUB_LINK,
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
