// @ts-ignore
/* eslint-disable */

declare namespace API {
  type LikesResponse = {
    likes: Record<number, number>; // {ID1: 点赞数,ID2: 点赞数, ...}
    likedByUser: Record<number, boolean>; // {ID1: 是否点赞, ID2: 是否点赞, ...} UserID作为参数，拿到这条返回值
  };

  type CategoryCourse = {
    categoryTitle: string; // 分类标题
    toolTip?: string; // 分类描述
    subTitle?: string; // 分类副标题
    courseNotes: CourseNote[]; // 课程笔记列表
  };

  type CourseNote = {
    courseId: number;
    code: string; // 课程代码
    title: string; // 课程标题
    category: number; // 课程分类
    toolTip?: string; // 课程描述
    enrollTime?: number; // 课程可以注册的时间
    noteList?: Note[]; // 课程笔记列表
  };

  type Note = {
    id: number; // 笔记ID
    courseId: number; // 课程ID
    title?: string;
    link?: string;
    author?: string; // 作者
    lecturer?: string; // 讲师
    toolTip?: string; // 笔记描述
    // views?: number; // 浏览量
    likes?: number; // 点赞数
    // comments?: number; // 评论数
    createTime?: Date; // 创建时间
    updateTime?: Date; // 更新时间
  };
}
