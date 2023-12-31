import { message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { auth, fireStore } from '../../firebase/firebase';
import { AddUserIcon, BlackPlusIcon, CollapseLabel, PlusIcon, TeamsInput } from '../../styles';
import { notificationMsg } from '../../utils';

interface Props {
  getFriends: () => Promise<void>;
}
export default function AddFriendModal({ getFriends }: Props) {
  const [input, setInput] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleClose = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(false);
  };

  const warningTrim = useCallback(() => {
    messageApi.warning('이메일을 입력 하세요.');
  }, []);

  const warningMsg = useCallback(() => {
    messageApi.warning('존재하지 않는 사용자 입니다.');
  }, []);

  const errorMsg = useCallback(() => {
    messageApi.error('이미 추가 된 사용자 입니다.');
  }, []);

  const successMsg = useCallback(() => {
    notificationMsg('친구 추가 되었습니다.');
  }, []);

  const inputOnChange = (e: any) => {
    setInput(e.target.value);
  };

  const addFriend = async (): Promise<void> => {
    const username = auth.currentUser.email;

    if (!input || input.trim() === '' || input.trim().length < 7) {
      warningTrim();
      return;
    }

    const users = await getDocs(collection(fireStore, 'users'));
    const filteredU = users.docs.filter((u) => u.data().name === input);
    if (filteredU[0]?.data()?.name !== input || filteredU?.length !== 1) {
      setInput('');
      warningMsg();
      return;
    }

    const friends = await getDocs(collection(fireStore, 'friends'));
    const filteredF = friends.docs.filter(
      (u) => u.data().friends.includes(username) && u.data().friends.includes(input),
    );
    if (filteredF?.length > 0) {
      setInput('');
      errorMsg();
      return;
    }

    await addDoc(collection(fireStore, 'friends'), {
      friends: [username, input],
    }).then(() => {
      getFriends();
      successMsg();
      setInput('');
      setIsModalOpen(false);
    });
  };

  return (
    <React.Fragment>
      {contextHolder}
      <CollapseLabel>
        Friends
        <BlackPlusIcon onClick={showModal} />
      </CollapseLabel>
      <Modal title="Add friend" open={isModalOpen} onCancel={handleClose} footer={[]}>
        <TeamsInput
          value={input}
          placeholder="example.gmail.com"
          onChange={inputOnChange}
          onPressEnter={addFriend}
          addonBefore={<AddUserIcon />}
          addonAfter={<PlusIcon onClick={addFriend} />}
        />
      </Modal>
    </React.Fragment>
  );
}
