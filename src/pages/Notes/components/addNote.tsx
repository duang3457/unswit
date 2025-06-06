import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { addNote } from '@/services/ant-design-pro/api';

const AddNote = () => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="新建笔记"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建笔记
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        try {
          // 调用后端接口，body 中携带表单值
          await addNote({
            data: values, // 如果后端需要 { name, company } 格式的 JSON
          });
          message.success('笔记创建成功');
          return true; // 返回 true 以关闭 ModalForm
        } catch (error) {
          console.error('添加笔记失败', error);
          message.error('笔记创建失败，请重试');
          return false; // 返回 false，保留 ModalForm 打开状态
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="笔记名称"
          tooltip="诸如：9021-XXXX笔记。(不需要加上自己的名字，后面会自动加上)"
          placeholder="请输入笔记名称"
          rules={[{ required: true }]}
        />

        <ProFormText
          width="md"
          name="company"
          label="笔记作者名称（选填，默认账号名称）"
          placeholder="请输入名称"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="contract"
          label="对应课程代码，如：9021"
          tooltip="请确认是4位数字。提交成功后，笔记会自动出现在对应课程下面"
          placeholder="请输入课程代码"
          rules={[{ required: true }]}
        />
        <ProFormText width="sm" name="id" label="leaturer名字（选填）" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          request={async () => [
            {
              value: 't1',
              label: 'Term 1',
            },
            {
              value: 't2',
              label: 'Term 2',
            },
            {
              value: 't3',
              label: 'Term 3',
            },
            {
              value: 'summer',
              label: 'Summer Term',
            },
          ]}
          width="xs"
          name="enrollmentTerm"
          label="注册课程的学期"
          rules={[{ required: true }]}
        />
        <ProFormSelect
          width="xs"
          options={[
            {
              value: '2023',
              label: '2023年',
            },
            {
              value: '2024',
              label: '2024年',
            },
            {
              value: '2025',
              label: '2025年',
            },
          ]}
          name="enrollmentYear"
          label="注册课程的年份"
          rules={[{ required: true }]}
        />
      </ProForm.Group>
      
      <ProFormText
        width="xl"
        name="project"
        label="笔记链接(请勿填入非法网站)"
        rules={[{ required: true , message: '任何笔记网站链接都可以，如notion, github-page, 技术论坛，博客等'}]}
      />
    </ModalForm>
  );
};

export default AddNote;