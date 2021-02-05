import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { changeField, initializeForm, register } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { check } from '../../modules/user';

const RegisterForm = ({ history }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  //input change handler
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: 'register',
        key: name,
        value,
      }),
    );
  };

  // submit form event handler
  const onSubmit = e => {
    e.preventDefault();
    const { username, password, passwordConfirm } = form;
    // blank check
    if ([username, password, passwordConfirm].includes('')) {
      setError('빈 칸을 모두 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      dispatch(changeField({ form: 'register', key: 'password', value: '' }));
      dispatch(
        changeField({ form: 'register', key: 'passwordConfirm', value: '' }),
      );
      return;
    }
    dispatch(register({ username, password }));
  };

  // init form, frist component render
  useEffect(() => {
    dispatch(initializeForm('register'));
  }, [dispatch]);

  //regist success or failure handling
  useEffect(() => {
    if (authError) {
      //username duplication
      if (authError.response.status === 409) {
        setError('이미 존재하는 아이디입니다.');
        return;
      }
      setError('회원가입 실패');
      return;
    }
    if (auth) {
      console.log('regist success');
      console.log(auth);
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  //set-up user value check
  useEffect(() => {
    if (user) {
      console.log('checked API');
      console.log(user);
      history.push('/');
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.log('localStorage is not working');
      }
    }
  }, [user, history]);

  /* user value correct?
  useEffect(() => {
    if (user) {
      history.push('/');
    }
  }, [history, user]); */

  return (
    <AuthForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default withRouter(RegisterForm);
