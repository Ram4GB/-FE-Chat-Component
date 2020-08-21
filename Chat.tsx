/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
    useState, useMemo, useRef, useEffect,
} from 'react';
import classNames from 'classnames';
import * as uuid from 'uuid';
import { Modal } from 'reactstrap';
import { retrieveImageFromClipboardAsFile } from '../../utils/imageUtil';

interface IFile {
    id: string;
    file: File | null;
}

interface IChat {
    message: string,
    orientation: string,
    isMessage: boolean,
    data?: Array<IFile>
}

enum ORIENTATION {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

export default function Chat() {
    const [isHide, setIsHide] = useState<boolean>(true);
    const [open, setOpen] = useState<boolean>(false);
    const [isDrag, setIsDrag] = useState<boolean>(false);
    const [image, setImage] = useState<string>('');
    const [list, setList] = useState<Array<IChat>>([]);
    const [listPreview, setListPreview] = useState<Array<IFile>>([]);
    const [message, setMessage] = useState<string>('');
    const containerMessageRef = useRef<HTMLDivElement>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const defaultOrientationMessageUserType = ORIENTATION.LEFT;

    const handleClickImage = (image: string) => {
        setImage(image);
        setOpen(true);
    };

    const Chat = ({ message, orientation } : { message : IChat, orientation: string}) => {
        // type message
        if (message.isMessage === true) {
            return (
                <div className={classNames('widget-chat__chat-item-container', {
                    'widget-chat__chat-item-darker': orientation === ORIENTATION.RIGHT,
                    'widget-chat__chat-item-white': orientation === ORIENTATION.LEFT,
                })}
                >
                    <pre className="widget-chat__message" dangerouslySetInnerHTML={{ __html: message.message }} />
                </div>
            );
        }

        // another type
        const images = message.data?.map((item) => {
            if (item.file && item.file.type && item.file.type.match('image.*')) {
                return (
                    <img
                        onClick={() => handleClickImage(window.URL.createObjectURL(item.file))}
                        key={item.id}
                        src={window.URL.createObjectURL(item.file)}
                        alt="files"
                    />
                );
            }
            return <img key={item.id} className="widget-chat__preview-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX///8zMzMiIiIpKSmFhYW0tLQ8PDwuLi5aWloaGhqtra3b29txcXGmpqYcHBwlJSWgoKDS0tJ+fn4WFhaIiIhsbGx6enqRkZHk5OQ3NzdiYmJHR0fv7+8FBQVgYGBtbW1RUVG9vb2amprGxsb29vb4nSqmAAAC3klEQVR4nO3daZKiQBBA4QK0aVxQxK1bZ3q9/xlnnJ5N4AdIZlZZ8d4B0C8SJBShnCMiIiIiIiIiIiIiIiIiIqJYqmaH7USmtW9LR9U+L9JMqnri29Ps+FhniWTlxjfpumWdi/ouxKCmOKmlfYERt6UCMKQddaoxwV/EQKZ4/iYlypsHcyBTXEh9iOaL3apJDGGKR7F9NFu47y1iAFN8b76pMcIgiU9iZ8KL0D0HRzwXUsAvYXjESu5c+CUMjviWSgtDI07lhYERNYSufV70SFQRBjVFHaHbNTfrj6gkbBNTX0QtYThTVBMGM0U9oXsJY4qKQrdoTXEfmTCMY1FVGMQUdYUdRPMpKgvbxNJ6itpC/1NUF7q95ynqC9tE248bA2EH0XJHtRD6naKJ0OsUbYRu0/zBy26KRsI2sZ5GJnSTBjGNTtgkRihsEGMUXl9rjlJ4RYxT6Lb/rgNFKvyPGKvQHf4QoxX+PRbvUZj3ErpDdrfCJHno0ym5Y+GQECJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQI+wnzdES97mj0LMz309nNTRd9iJ6Fq9mYbS773HjrW7gcs801QoSiIbwlhAhlQ3hLCBHKhvCW7kGYHY7zmztu+zyXyfc34KwYUa8HT/kW6ocQIUKECBEiRIgQIcIkeep1C1PPQhSO+wbcqPvxmgjFQigQQuUQCoRQOYQCIVQOoUAIldP4X1ujeYjC5PQo12vnXxV9C5NcsM4X8C5UDyFChAgRIkSIECFChFEJBdddGyh8MxIKrp03rLIyEgqufzis4mwkFFzDclD5gxVQcB3SQa3ezYRya8kOqj6aCd1edlH1fmWWa3jIrek8oPrTUOhm9vup2dIPv2suzKBesbUFOrexnWJtDnRuXdudFfNa8rJP7+anwsaY169zH8CffTyn5SrTbVWmuw9Pvkuf1XKi27IyPUkQERERERERERERERERERGRZj8AQWZnsIm2AjMAAAAASUVORK5CYII=" alt="" />;
        }

        );

        return (
            <div
                className={classNames('widget-chat__chat-item-container', {
                    'widget-chat__chat-item-darker': orientation === ORIENTATION.RIGHT,
                    'widget-chat__chat-item-white': orientation === ORIENTATION.LEFT,
                })}
                style={{ background: 'none' }}
            >
                <div className="widget-chat__group-file">
                    {images}
                </div>
            </div>
        );
    };

    const handleCloseChat = () => {
        setIsHide((value) => !value);
    };

    const handleChange = (e: any) => {
        setMessage(e.target.value);
    };

    const handleSubmitChat = () => {
        if (message) {
            // at least 1 word
            const match = message.match(/[\w+]/g);
            if (match) {
                setList((list) => [...list, { message, orientation: defaultOrientationMessageUserType, isMessage: true }]);
                setMessage('');
            } else setMessage('');
        }
        if (listPreview.length > 0) {
            setList((list) => [...list, {
                message, orientation: defaultOrientationMessageUserType, data: listPreview, isMessage: false,
            }]);
            setListPreview([]);
        }
    };

    useEffect(() => {
        const target = containerMessageRef.current;
        if (target) { target.scrollTop = target.scrollHeight; }
    }, [list]);

    const handleKeyEnter = async (e: any) => {
        if (e.shiftKey && e.keyCode === 13) {
            e.preventDefault();
            return setMessage((m) => `${m} \n`);
        }
        if (e.keyCode === 13) {
            return handleSubmitChat();
        }
        return null;
    };

    const handleChangeInputFile = (event: any) => {
        if (event.target.files.length > 0) {
            const files: Array<IFile> = [];
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < event.target.files.length; i++) {
                const file: IFile = { file: null, id: '' };
                file.id = uuid.v4();
                // eslint-disable-next-line prefer-destructuring
                file.file = event.target.files[i];
                files.push(file);
            }
            setListPreview((list) => [...list, ...files]);
        }
        const target = inputFileRef.current;
        if (target) target.value = '';
        if (textAreaRef && textAreaRef.current) textAreaRef.current.focus();
    };

    const handleRemoveFile = (idFile: string) => {
        setListPreview(() => listPreview.filter((item) => item.id !== idFile));
    };

    const FilePreviewItemImage = ({ file }:{file: IFile}) => {
        const base64 = window.URL.createObjectURL(file.file);

        return (
            <div className="widget-chat__preview-file-item">
                <i onClick={() => handleRemoveFile(file.id)} className="fas fa-times" />
                <img className="widget-chat__preview-image" src={base64} alt="" />
            </div>
        );
    };

    const FilePreviewItemNomal = ({ file } : {file: IFile}) => (
        <div className="widget-chat__preview-file-item">
            <i onClick={() => handleRemoveFile(file.id)} className="fas fa-times" />
            <img
                className="widget-chat__preview-image"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX///8zMzMiIiIpKSmFhYW0tLQ8PDwuLi5aWloaGhqtra3b29txcXGmpqYcHBwlJSWgoKDS0tJ+fn4WFhaIiIhsbGx6enqRkZHk5OQ3NzdiYmJHR0fv7+8FBQVgYGBtbW1RUVG9vb2amprGxsb29vb4nSqmAAAC3klEQVR4nO3daZKiQBBA4QK0aVxQxK1bZ3q9/xlnnJ5N4AdIZlZZ8d4B0C8SJBShnCMiIiIiIiIiIiIiIiIiIqJYqmaH7USmtW9LR9U+L9JMqnri29Ps+FhniWTlxjfpumWdi/ouxKCmOKmlfYERt6UCMKQddaoxwV/EQKZ4/iYlypsHcyBTXEh9iOaL3apJDGGKR7F9NFu47y1iAFN8b76pMcIgiU9iZ8KL0D0HRzwXUsAvYXjESu5c+CUMjviWSgtDI07lhYERNYSufV70SFQRBjVFHaHbNTfrj6gkbBNTX0QtYThTVBMGM0U9oXsJY4qKQrdoTXEfmTCMY1FVGMQUdYUdRPMpKgvbxNJ6itpC/1NUF7q95ynqC9tE248bA2EH0XJHtRD6naKJ0OsUbYRu0/zBy26KRsI2sZ5GJnSTBjGNTtgkRihsEGMUXl9rjlJ4RYxT6Lb/rgNFKvyPGKvQHf4QoxX+PRbvUZj3ErpDdrfCJHno0ym5Y+GQECJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQI+wnzdES97mj0LMz309nNTRd9iJ6Fq9mYbS773HjrW7gcs801QoSiIbwlhAhlQ3hLCBHKhvCW7kGYHY7zmztu+zyXyfc34KwYUa8HT/kW6ocQIUKECBEiRIgQIcIkeep1C1PPQhSO+wbcqPvxmgjFQigQQuUQCoRQOYQCIVQOoUAIldP4X1ujeYjC5PQo12vnXxV9C5NcsM4X8C5UDyFChAgRIkSIECFChFEJBdddGyh8MxIKrp03rLIyEgqufzis4mwkFFzDclD5gxVQcB3SQa3ezYRya8kOqj6aCd1edlH1fmWWa3jIrek8oPrTUOhm9vup2dIPv2suzKBesbUFOrexnWJtDnRuXdudFfNa8rJP7+anwsaY169zH8CffTyn5SrTbVWmuw9Pvkuf1XKi27IyPUkQERERERERERERERERERGRZj8AQWZnsIm2AjMAAAAASUVORK5CYII="
                alt=""
            />
            <p className="widget-chat__preview-name-file">{file.file?.name}</p>
        </div>
    );

    const renderPreviewItemFile = useMemo(() => listPreview.length > 0 && listPreview.map((item: IFile) => {
        if (item.file && item.file.type && item.file.type.match('image.*')) {
            return <FilePreviewItemImage key={item.id} file={item} />;
        }
        return <FilePreviewItemNomal key={item.id} file={item} />;
    }),
    [listPreview]);

    const renderChat = useMemo(() => list && list.map((item) => {
        if (item.orientation === ORIENTATION.LEFT) { return <Chat orientation={ORIENTATION.LEFT} key={uuid.v4()} message={item} />; }
        return <Chat key={uuid.v4()} message={item} orientation={ORIENTATION.RIGHT} />;
    }), [list]);

    useEffect(() => {
        if (window) {
            document.ondrag = () => {
                setIsDrag(true);
                if (textAreaRef && textAreaRef.current) { textAreaRef.current.classList.add('widget-chat__input--dragging'); }
                if (containerMessageRef && containerMessageRef.current) containerMessageRef.current.classList.add('widget-chat__area-message--is-dragging');
            };

            document.ondragend = () => {
                setIsDrag(false);
                if (textAreaRef && textAreaRef.current) { textAreaRef.current.classList.remove('widget-chat__input--dragging'); }
                if (containerMessageRef && containerMessageRef.current) containerMessageRef.current.classList.remove('widget-chat__area-message--is-dragging');
            };
        }

        return () => {
            setIsDrag(false);
            if (textAreaRef && textAreaRef.current) { textAreaRef.current.classList.remove('widget-chat__input--dragging'); }
            if (containerMessageRef && containerMessageRef.current) containerMessageRef.current.classList.remove('widget-chat__area-message--is-dragging');
        };
    }, []);

    const handlePasteIntoTextarea = (e: any) => {
        retrieveImageFromClipboardAsFile(e, (file: File) => {
            if (file) {
                setListPreview((list) => [...list, { id: uuid.v4(), file }]);
            }
        });
    };

    return (
        <React.Fragment>
            <div className={classNames('widget-chat', {
                'is-hide': isHide,
            })}
            >
                <div onClick={handleCloseChat} className="widget-chat__top-header">
                    <div className="widget-chat__top-header-left">
                        <i className="fas fa-cog" />
                        <span className="widget-chat__order-name">DH-000001</span>
                    </div>
                    <div className="widget-chat__top-header-right">
                        <i onClick={handleCloseChat} className="fas fa-times" />
                    </div>
                </div>
                <div className={classNames('widget-chat__body')}>
                    <div ref={containerMessageRef} id="chatContainer" style={{ overflowY: list.length > 0 ? 'scroll' : 'auto' }} className="widget-chat__area-message">
                        {renderChat}
                    </div>
                    <div className="widget-chat__wrap-action">
                        <div className="widget-chat__preview-file">
                            {renderPreviewItemFile}
                        </div>
                        <div className="widget-chat__wrap-input">
                            {
                                useMemo(() => (
                                    <textarea
                                        onKeyUp={handleKeyEnter}
                                        value={message}
                                        onChange={handleChange}
                                        placeholder={isDrag === false ? 'Mời bạn điền chat ở đây...' : 'Mời bạn kéo thả vào đây'}
                                        className="widget-chat__input"
                                        ref={textAreaRef}
                                        onPaste={handlePasteIntoTextarea}
                                    />
                                ), [message])
                            }
                        </div>
                        <div style={{ display: isDrag ? 'none' : 'flex' }} className="widget-chat__group-icons-action">
                            <label htmlFor="file-input-image">
                                <i className="far fa-images" />
                            </label>
                            <span>
                                {
                                    useMemo(() => (
                                        <input
                                            accept="image/x-png,image/gif,image/jpeg"
                                            ref={inputFileRef}
                                            multiple
                                            id="file-input-image"
                                            onChange={handleChangeInputFile}
                                            type="file"
                                            style={{ display: 'none' }}
                                        />
                                    ), [listPreview])
                                }
                            </span>
                            <i className="fas fa-camera" />
                            <label htmlFor="file-input">
                                <i className="fas fa-paperclip" />
                            </label>
                            <span>
                                {
                                    useMemo(() => (
                                        <input
                                            ref={inputFileRef}
                                            multiple
                                            id="file-input"
                                            onChange={handleChangeInputFile}
                                            type="file"
                                            style={{ display: 'none' }}
                                        />
                                    ), [listPreview])
                                }
                            </span>
                            <i onClick={handleSubmitChat} className="fas fa-paper-plane" />
                        </div>
                    </div>
                </div>
            </div>
            <Modal style={{ top: 20 }} toggle={() => { setOpen(false); setImage(''); }} isOpen={open}>
                <div className="p-5">
                    <img src={image} alt="" />
                </div>
            </Modal>
        </React.Fragment>
    );
}
