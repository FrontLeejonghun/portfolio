import React, { useCallback, useEffect, useState, KeyboardEvent, ChangeEvent, useRef } from 'react';
import classNames from 'classnames/bind';
import { TopHeader } from 'components';
import { commandText, textData } from './content';
import styles from './LandingPage.module.scss';

const cx = classNames.bind(styles);

export const LandingPage = () => {
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [animationEnd, setAnimationEnd] = useState(false);
  const [inputText, setInputText] = useState('');
  const [typeContent, setTypeContent] = useState<Array<string>>([]);

  useEffect(() => window.scroll(0, document.body.scrollHeight), [typeContent]);

  useEffect(() => {
    let counter = 0;

    const checkAniEnd = () => {
      counter = counter + 1;
      if (counter === textData.length) {
        setAnimationEnd(true);
        inputRef.current.focus();
      }
    };

    document.body?.addEventListener('animationend', checkAniEnd);
    return () => document.body?.removeEventListener('animationend', checkAniEnd);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addText(e.target);
  }, []);

  const onChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputText(e.target.value),
    [],
  );

  const findItem = useCallback((currentValue) => {
    if (currentValue === 'clear') {
      setTypeContent([]);
    }
    return commandText.find((v) => v.key === currentValue.toLowerCase());
  }, []);

  const addText = useCallback((target) => {
    if (target.value.length <= 0) {
      setTypeContent((typeContent) => [
        ...typeContent,
        `<span style='color: #6677f2'>LeeJongHun-ui-MacBookPro:~</span>`,
      ]);
    } else {
      const result = findItem(target.value);
      setTypeContent((typeContent) => [
        ...typeContent,
        result
          ? `<span style='color: #6677f2'>LeeJongHun-ui-MacBookPro:~ </span>${target.value}<br>${result.text}`
          : `<span style='color: #F8616B'>zsh: command not found</span> <span>${target.value}</span>`,
      ]);
    }

    setInputText('');
  }, []);

  return (
    <>
      <TopHeader />
      <div className={cx('landing-wrap')}>
        <div className={cx('typing-text-wrap')}>
          {textData.map((v) => {
            return (
              <span className={cx('typing-text')} key={v.text}>
                {v.text}
              </span>
            );
          })}
        </div>
        <div className={cx('user-type-content-wrap')}>
          {typeContent.map((text, i) => {
            return (
              <span
                className={cx('user-type-content')}
                key={i}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            );
          })}
        </div>
        {animationEnd ? (
          <div className={cx('input-wrap')}>
            <span className={cx('highlight-color')}>LeeJongHun-ui-MacBookPro:~</span>
            <input
              className={cx('terminal-input')}
              type="text"
              disabled={!animationEnd}
              onChange={onChangeInput}
              onKeyDown={handleKeyDown}
              value={inputText}
              ref={inputRef}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
