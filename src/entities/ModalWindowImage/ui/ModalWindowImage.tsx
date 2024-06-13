import classNames from 'classnames';
import styles from './ModalWindowImage.module.scss';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  setOpenModalWindowImage,
  deleteImage,
  setBlockData,
  setDeletedBlockData,
} from '../index';
import { del, greenKr, usb } from 'shared/icons/_index';
import { useEffect, useState } from 'react';
import { useRef, RefObject } from 'react';
import { ChangeEvent } from 'react';
// import { setinWindImg, setActiveCardItem } from '../index'

export const ModalWindowImage = () => {
  const dispatch = useAppDispatch();

  const activeRow = useAppSelector((state) => state.cardReducer.activeRow);
  const activeCard = useAppSelector((state) => state.cardReducer.activeCard);
  const order_num = useAppSelector(
    (state) => state.UploadImageReducer.order_num
  );
  const filePicker = useRef<HTMLElement | null>(null);
  const ref = useRef<null | HTMLParagraphElement>(null);

  const [src, setSrc] = useState<string>('');
  const [size, setSize] = useState<number>(0);

  useEffect(() => {
    let array_block_data = activeCard.block_description_result.find((item) => {
      return item.id === activeRow;
    });
    let block_data = undefined;

    try {
      console.log(array_block_data);
      if (array_block_data!.sizeOfImg !== undefined) {
        setSize(array_block_data!.sizeOfImg);
      } else if (Number(array_block_data!.block_insert_data_type) === 0) {
        setSize(1000);
      } else if (Number(array_block_data!.block_insert_data_type) === 1) {
        setSize(500);
      } else if (Number(array_block_data!.block_insert_data_type) === 2) {
        setSize(200);
      }

      block_data = array_block_data!.block_data.find((item) => {
        return item.order_num === order_num;
      })?.block_data;
    } catch (error) {
      console.log(error);
    }

    let url_block_data = activeCard.block_description_result
      .find((item) => {
        return item.id === activeRow;
      })!
      .block_data.find((item) => {
        return item.order_num === order_num;
      })?.url_block_data;

    if (url_block_data !== undefined) {
      setSrc(url_block_data);
    } else if (block_data !== undefined) {
      setSrc(block_data);
    } else {
      setSrc('');
    }
  }, [activeCard.block_description_result, order_num]);

  const file2Base64 = (file: File | null): Promise<string> | string => {
    if (file == null) {
      return '';
    } else {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || '');
        reader.onerror = (error) => reject(error);
      });
    }
  };

  const clickDelete = () => {
    console.log('clickDelete');
    let row = activeCard.block_description_result.find((item) => {
      return item.id === activeRow;
    });
    if (row !== undefined) {
      if (
        row.block_data.find((item) => {
          return item.order_num === order_num;
        })?.created === true
      ) {
        dispatch(
          setDeletedBlockData(
            row.block_data.find((item) => {
              return item.order_num === order_num;
            })?.id
          )
        );
        dispatch(
          deleteImage(
            row.block_data.find((item) => {
              return item.order_num === order_num;
            })?.id
          )
        );
        setSrc('');
      } else {
        setSrc('');
        dispatch(
          deleteImage(
            row.block_data.find((item) => {
              return item.order_num === order_num;
            })?.id
          )
        );
      }
    }
  };

  const handlePick = () => {
    if (filePicker.current != null) {
      filePicker.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let block_data = await file2Base64(e.target.files[0]);
      dispatch(
        setBlockData({
          block_data: block_data,
          id: 1,
          order_num: order_num,
          url_block_data: URL.createObjectURL(e.target.files[0]),
        })
      );
      let UrlBlockData = URL.createObjectURL(e.target.files[0]);
      setSrc(UrlBlockData);
    }
  };

  return (
    <>
      <div className={classNames(styles.background)}></div>
      <div className={classNames(styles.body)} ref={ref}>
        <div className="header services">
          <div className={classNames(styles.wrapper_header)}>
            <div>
              <div className="header_title">Изображение</div>
            </div>

            <div>
              <button
                className={classNames(styles.add_btn)}
                onClick={handlePick}>
                <img src={usb} alt="" />
                <>Добавить файлы</>
              </button>
            </div>
            <div>
              <button
                disabled={Boolean(src === '')}
                className={classNames(styles.del_btn)}
                onClick={() => {
                  // dispatch(setinWindImg(true))
                  clickDelete();
                }}>
                <img src={del} alt="" width={15} height={15} />
                <span>Удалить</span>
              </button>
            </div>
            <div>
              <button
                className={classNames(styles.close_btn)}
                onClick={() => {
                  dispatch(setOpenModalWindowImage(false));
                  // dispatch(setinWindImg(false))
                }}>
                <img src={greenKr} alt="close_btn" />
              </button>
            </div>
          </div>
        </div>
        <div className={classNames(styles.content)}>
          <div className={classNames(styles.active_wrapper_miniImg)}>
            <div className={classNames(styles.miniImg)}>
              {Boolean(src) ? (
                <>
                  {src.includes('blob') ? (
                    <img src={src} width={120} height={120} alt="" />
                  ) : (
                    <img
                      src={` data:image/png;base64,${src}`}
                      width={120}
                      height={120}
                      alt=""
                    />
                  )}
                </>
              ) : (
                <>
                  {size === 1000 && (
                    <div className={classNames(styles.miniImg1000)}></div>
                  )}
                  {size === 500 && (
                    <div className={classNames(styles.miniImg500)}></div>
                  )}
                  {size === 200 && (
                    <div className={classNames(styles.miniImg200)}></div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={classNames(styles.wrapper_maxImg)}>
            {Boolean(src) ? (
              <div className={classNames(styles.maxImg)}>
                {src.includes('blob') ? (
                  <img src={src} alt="" />
                ) : (
                  <img src={` data:image/png;base64,${src}`} alt="" />
                )}
              </div>
            ) : (
              <div className={classNames(styles.maxImgEmpty)}></div>
            )}
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            ref={filePicker as RefObject<HTMLInputElement>}
            accept="image/png, image/jpeg"
            className={styles.inputFile}
          />
        </div>
      </div>
    </>
  );
};
