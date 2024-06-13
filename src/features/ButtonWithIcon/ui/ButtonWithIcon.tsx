import { MouseEventHandler, useState } from 'react';
import styles from './ButtonWithIcon.module.scss';
import classNames from 'classnames';

interface Props {
  iconActive: string;
  iconDisabled: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
  toolTip?: string;
  right?: number;
  top?: number;
}

export const ButtonWithIcon = ({
  iconActive,
  iconDisabled,
  onClick,
  isDisabled,
  toolTip,
  right,
  top,
}: Props) => {
  const [display, setDisplay] = useState('none');

  return (
    <>
      <button
        className={styles.body}
        onClick={onClick}
        disabled={isDisabled}
        onMouseOver={() => setDisplay('inline-block')}
        onMouseOut={() => setDisplay('none')}>
        {isDisabled === true ? (
          <img src={iconDisabled} alt="" />
        ) : (
          <img src={iconActive} alt="" />
        )}
      </button>
      {toolTip && (
        <div
          className={classNames(styles.toolTip)}
          style={{
            right: `${right}px`,
            top: `${top}px`,
            display: `${display}`!,
          }}>
          <div>{toolTip}</div>
        </div>
      )}
    </>
  );
};
