import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

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
        await waitTime(2000);
        console.log(values.name);
        message.success('提交成功');
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="笔记名称"
          tooltip="诸如：9021-XXXX笔记-拙见勿喷谢谢大家(不需要加上自己的名字，后面会自动加上)"
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
          label="对应课程代码，如：9021，请确认是4位数字。提交成功后，笔记会自动出现在对应课程下面"
          tooltip="如果你的课程代码与众不同，请联系我们，感谢！"
          placeholder="请输入课程代码"
          rules={[{ required: true }]}
        />
        {/* <ProFormDateRangePicker name="contractTime" label="合同生效时间" /> */}
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
      <ProFormText width="sm" name="id" label="leaturer名字（选填）" />
      <ProFormText
        width="xl"
        name="project"
        label="笔记链接(填入非法网站永久封号)"
        rules={[{ required: true , message: '任何笔记网站链接都可以，如notion, github-page, 技术论坛，博客等'}]}
      />
    </ModalForm>
  );
};

export default AddNote;