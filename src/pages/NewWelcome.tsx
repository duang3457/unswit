import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ArrowRightOutlined } from '@ant-design/icons';

const TitleContainer = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
`;
const MainTitle = styled.span`
  color: black;
  font-size: clamp(2.5rem, 8vw, 80px);
  font-family: 'Bungee', sans-serif;
  font-weight: 400;
  line-height: 1.1; /* 统一行高，保证主标题和副标题风格一致 */
  letter-spacing: 0.08em;
  word-wrap: break-word;
`;
const SubTitle = styled.span`
  font-size: clamp(2.25rem, 7vw, 72px);
  font-family: 'Bungee', sans-serif;
  font-weight: 400;
  line-height: 1.1; /* 统一行高，保证主标题和副标题风格一致 */
  letter-spacing: 0.072em;
  word-wrap: break-word;
  margin-top: 0;
  color: transparent;
  -webkit-text-stroke: 2px black;
  text-stroke: 2px black;
`;

const SubtitleRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;
const SubtitleLine = styled.div`
  height: 2px;
  width: 2.5rem;
  background: #222;
  margin-right: 1rem;
  border-radius: 1px;
`;
const SubtitleText = styled.span`
  font-size: 1.1rem;
  color: #222;
  font-family: 'ABeeZee', sans-serif;
  letter-spacing: 0.1em;
`;

const LoginButton = styled.button`
  margin-top: 2rem;
  padding: clamp(0.5rem, 2.5vw, 1.2rem) clamp(1.2rem, 5vw, 2.2rem);
  font-size: clamp(0.9rem, 2.5vw, 1.25rem);
  font-family: 'ABeeZee', sans-serif;
  font-weight: 400;
  color: #fff;
  background: #000;
  border: none;
  border-radius: 999rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0,0,0,0.10);
  transition: background 0.2s;
  &:hover {
    background: #222;
  }
`;
const BottomLeftInfo = styled.div`
  margin-top: 2rem;
  min-width: 180px;
  max-width: 15vw;
  font-family: 'ABeeZee', sans-serif;
  color: #222;
  font-size: 1.1rem;
  line-height: 1.5;
  z-index: 1;
  @media (max-width: 1200px) {
    display: none;
  }
`;
const InfoLine = styled.div`
  margin-bottom: 0.5rem;
`;
const InfoDivider = styled.div`
  height: 1px;
  background: #d9d9d9;
  margin: 0.2rem 0 0.5rem 0;
  width: 100%;
`;
const InfoLink = styled.a`
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const InfoSection = styled.div`
  width: 100%;
  max-width: 1250px;
  margin: 2rem 4vw 0 0;
  font-family: 'ABeeZee', sans-serif;
  color: #222;
  font-size: 0.735rem;
  line-height: 1.7;
  h3 {
    font-size: clamp(1rem, 1.8vw, 1.6rem);/
    font-family: 'ABeeZee', sans-serif;
    margin: 1rem 0 1rem 0;
    font-weight: 450;
    letter-spacing: 0.04em;
    line-height: 1.2;
  }
  p {
    font-size: 0.945rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.7em;
    margin-right: 0;
    max-width: clamp(224px, 42vw, 730px);
    width: 100%;
  }
`;

const SectionDivider = styled.hr`
  border: 0;
  border-top: 1.5px solid #e0e0e0;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  align-self: flex-start;
`;

const RowWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  gap: 30vw;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }
`;

const OuterLeftSpacer = styled.div`
  display: flex;
  flex-direction: row;
  height: auto;
  position: relative;


  /* 左下角梦幻蓝色光晕背景 */
  &::before {
    content: '';
    position: absolute;
    left: -120px;
    bottom: -120px;
    width: 300px;
    height: 300px;
    background: #D6F2FF;
    box-shadow: 0 0 300px 100px #D6F2FF;
    border-radius: 9999px;
    filter: blur(150px);
    z-index: 0;
    pointer-events: none;
  }

  /* 右上角梦幻蓝色光晕背景 */
  &::after {
    content: '';
    position: absolute;
    right: -120px;
    top: -120px;
    width: 300px;
    height: 300px;
    background: #D6F2FF;
    box-shadow: 0 0 300px 100px #D6F2FF;
    border-radius: 9999px;
    filter: blur(150px);
    z-index: 0;
    pointer-events: none;
  }
`;
const LeftGap = styled.div`
  width: 2.5vw;
  min-width: 20px;
  height: 100vh;
  flex-shrink: 0;
`;


const NewWelcome: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bungee&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);


  return (
    <OuterLeftSpacer>
      <LeftGap />
      <div style={{flex: 1}}>
        <SubtitleRow>
          <SubtitleLine />
          <SubtitleText>UNSWIT 学习社区</SubtitleText>
        </SubtitleRow>
        <TitleContainer>
          <MainTitle>
            WELCOME UNSWIT <br />STUDY FORUM
          </MainTitle>
          <SubTitle>
            Learning and  <br />exchange
          </SubTitle>
          <LoginButton onClick={() => window.location.href = '/user/login'}>
            Log in <ArrowRightOutlined style={{ fontSize: '1.2em' }} />
          </LoginButton>
        </TitleContainer>
        <RowWrapper>
          <BottomLeftInfo>
            <InfoLine>
              <InfoLink href="/forum">UNSWIT<br/>STUDY FORUM</InfoLink>
            </InfoLine>
            <InfoDivider />
            <InfoLine>
              <InfoLink href="/notes">Note/Resource<br/>sharing platform</InfoLink>
            </InfoLine>
            <InfoDivider />
            <InfoLine>The University of<br/>New South Wales</InfoLine>
          </BottomLeftInfo>
          <InfoSection>
            <h3>写在前面</h3>
            <p>
              Hello, UNSWit 学习社区的朋友们！我们很高兴地宣布，UNSWit 学习社区正式上线啦！🎉<br />
              我们是普通的UNSW学IT的中国学生。我们希望通过这个平台，能够为大家提供一个友好、开放的学习环境，让每位成员在网站资源中有所收获，让每位成员都能在这里找到志同道合的伙伴，共同进步。<br />
              这里是一个专为UNSW学生和校友打造的学习交流平台，旨在帮助大家更好地学习和分享知识。无论你是新生还是老生，这里都有丰富的资源和热情的社区等着你来探索！
            </p>
            <SectionDivider />
            <h3>笔记区灵感（为什么要做笔记/资源分享平台）</h3>
            <p>
              俗话说得好：好记性不如烂笔头。一个好的学习方式是将自己在课上的输入，尝试在笔记中输出出来。<br />
              同时，我们希望能够做出一个友好的学习圈子：因为今日你的笔记，就是明日他人的宝藏。<br />
              虽然我们身处在不同的地方/教室/图书馆，但是我们的笔记可以将我们联系起来，<br />
              从此，空阔的教室将不再只有你一个人，我们在学习路上将不再孤独，我们的留学生活要更加充实。<br />
              最后，让我们在笔下相遇，互相学习，共同进步。 Power! （口拙舌笨，词不达意，敬请谅解）
            </p>
            <SectionDivider />
            <h3>论坛区灵感（为什么要开个论坛，与小红书/微信的区别在哪里）</h3>
          </InfoSection>
        </RowWrapper>
      </div>
    </OuterLeftSpacer>
  );
};

export default NewWelcome;
