import { useEffect, useState, useRef } from 'react';
import PropTypes from "prop-types";
import gsap from 'gsap';
import chroma from 'chroma-js';
import '../../css/ButtonGlow.css';
import { Link } from '@inertiajs/react';
import { IoMdArrowRoundBack } from "react-icons/io";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { router } from '@inertiajs/react';

const GlowButton = ({ value = "", href = "#", backgroundColor = "#09041e", textColor = "white", image = "", imageClass = "", icon = "" }) => {
    const buttonRef = useRef(null);
    const gradientRef = useRef(null);
    useEffect(() => {
        const button = buttonRef.current;
        const gradientElem = gradientRef.current;

        if (!gradientElem) {
            throw new Error('Gradient element not found');
        }

        const handlePointerMove = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.to(button, {
                '--pointer-x': `${x}px`,
                '--pointer-y': `${y}px`,
                duration: 0.6,
            });

            gsap.to(button, {
                '--button-glow': chroma
                    .mix(
                        getComputedStyle(button)
                            .getPropertyValue('--button-glow-start')
                            .trim(),
                        getComputedStyle(button).getPropertyValue('--button-glow-end').trim(),
                        x / rect.width
                    )
                    .hex(),
                duration: 0.2,
            });
        };

        if (button && gradientElem) {
            button.addEventListener('pointermove', handlePointerMove);

            return () => {
                button.removeEventListener('pointermove', handlePointerMove);
            };
        }
    }, [buttonRef, gradientRef]);

    return (
        <div className='mx-1 flex z-10 w-[inherit]'>
            <a ref={buttonRef} href={href} className="glow-button text-center">
                <span className={`flex bg-[${backgroundColor}] text-[${textColor}]`}>
                    {image ? <img src={`${image}`} className={`${imageClass}`} /> : ""}
                    {icon ? <i className={icon}></i> : ""}
                    {value}
                </span>
                <div ref={gradientRef} className="gradient"></div>
            </a>
        </div>
    );
};
GlowButton.propTypes = {
    value: PropTypes.string,
    href: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    image: PropTypes.string,
    imageClass: PropTypes.string,
    icon: PropTypes.string,
};

const GlowSubmitButton = (props) => {
    var { value, backgroundColor, textColor } = props;
    backgroundColor = backgroundColor ? backgroundColor : "#09041e";
    textColor = textColor ? textColor : "white";
    value = value ? value : "";

    const buttonRef = useRef(null);
    const gradientRef = useRef(null);
    useEffect(() => {
        const button = buttonRef.current;
        const gradientElem = gradientRef.current;

        if (!gradientElem) {
            throw new Error('Gradient element not found');
        }

        const handlePointerMove = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.to(button, {
                '--pointer-x': `${x}px`,
                '--pointer-y': `${y}px`,
                duration: 0.6,
            });

            gsap.to(button, {
                '--button-glow': chroma
                    .mix(
                        getComputedStyle(button)
                            .getPropertyValue('--button-glow-start')
                            .trim(),
                        getComputedStyle(button).getPropertyValue('--button-glow-end').trim(),
                        x / rect.width
                    )
                    .hex(),
                duration: 0.2,
            });
        };

        if (button && gradientElem) {
            button.addEventListener('pointermove', handlePointerMove);

            return () => {
                button.removeEventListener('pointermove', handlePointerMove);
            };
        }
    }, [buttonRef, gradientRef]);

    return (
        <div className='flex z-10'>
            <button type="submit" ref={buttonRef} className="glow-button text-center">
                <span className={`bg-[${backgroundColor}] text-[${textColor}]`}>{value}</span>
                <div ref={gradientRef} className="gradient"></div>
            </button>
        </div>
    );
};
GlowSubmitButton.propTypes = {
    value: PropTypes.string,
    href: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    image: PropTypes.string,
    imageClass: PropTypes.string,
    icon: PropTypes.string,
};

const BouncingButton = () => {
    return (
        <a href="#thanks" className="animate-bounce mb-[50px] bg-white dark:bg-slate-800 p-2 w-10 h-10 ring-1 self-center ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-violet-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        </a>
    )
}

const Button = ({ value = "", href = "#", hoverBackgroundColor = "var(--light-grey)", hoverTextColor = "", backgroundColor = "transparent", borderColor = "white", textColor = "white", image = "", imageClass = "", icon = "" }) => {
    return (
        <Link href={href} className={`bg-[${backgroundColor}] text-[${textColor}] rounded-xl p-3 px-8 ${borderColor ? 'border-2' : ''} border-[${borderColor}] transition hover:bg-[${hoverBackgroundColor}] hover:text-[${hoverTextColor}]`}>
            {image ? <img src={`${image}`} className={`${imageClass}`} /> : ""}
            {icon ? <i className={icon}></i> : ""}
            {value}
        </Link>
    );
};
Button.propTypes = {
    value: PropTypes.string,
    href: PropTypes.string,
    hoverBackgroundColor: PropTypes.string,
    hoverTextColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    borderColor: PropTypes.string,
    textColor: PropTypes.string,
    image: PropTypes.string,
    imageClass: PropTypes.string,
    icon: PropTypes.string,
};

const SubmitButton = ({ value = "", hoverBackgroundColor = "var(--light-grey)", hoverTextColor = "", backgroundColor = "transparent", borderColor = "white", textColor = "white", image = "", imageClass = "", icon = "" }) => {
    return (
        <div className='flex items-center gap-5'>
            {image ? <img src={`${image}`} className={`${imageClass}`} /> : ""}
            {icon ? <i className={icon}></i> : ""}
            <input value={value} type="submit" className={`bg-[${backgroundColor}] text-[${textColor}] rounded-xl p-3 px-8 ${borderColor ? 'border-2' : ''} border-[${borderColor}] transition hover:bg-[${hoverBackgroundColor}] hover:text-[${hoverTextColor}] hover:cursor-pointer`} />
        </div>
    );
};
SubmitButton.propTypes = {
    value: PropTypes.string,
    hoverBackgroundColor: PropTypes.string,
    hoverTextColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    borderColor: PropTypes.string,
    textColor: PropTypes.string,
    image: PropTypes.string,
    imageClass: PropTypes.string,
    icon: PropTypes.string,
};

const BackButton = ({ className = '', iconClass = '' }) => {
    const defaultClass = "w-[40px] p-3 rounded-full self-start transition hover:bg-[var(--hover-light)]";
    const handleClick = () => {
        window.history.back();
    };
    return (
        <Link onClick={handleClick} className={`${defaultClass} ${className}`}>
            <IoMdArrowRoundBack className={iconClass} />
        </Link>
    );
};
BackButton.propTypes = {
    className: PropTypes.string,
    iconClass: PropTypes.string,
};

const FollowButton = ({ user = null, onClick = () => { }, href = '' }) => {
    const [isUserFollowing, setUserFollowing] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const handleFollow = async () => {
        onClick();
        try {
            const response = await axios.post(`/user/follow/${user.username}`);
            setUserFollowing(response.data.status);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const checkFollowingStatus = async () => {
            try {
                const response = await axios.get(`/user/following/${user.username}`);
                setUserFollowing(response.data.status);
            } catch (error) {
                console.error(error);
            }
        };
        checkFollowingStatus();
    }, [user]);

    let text = 'Follow';
    if (isUserFollowing) {
        text = isHovering ? 'Unfollow' : 'Following';
    }

    return (
        <Link
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleFollow}
            href={href}
            className={`min-w-[110px] text-center min-h-[25px] border-1 ${isUserFollowing && isHovering ? 'bg-[var(--hover-like-red)] border-[var(--pink)] text-[var(--red)] py-[0.56rem]' : isUserFollowing ? 'bg-white border text-black hover:text-[var(--red)] hover:bg-[var(--hover-red)]' : 'bg-black text-white hover:bg-[var(--hover-black)]'} font-bold py-2 px-4 text-sm rounded-full transition `}
        >
            <span className={`${isUserFollowing && isHovering ? '' : ''}`}>{text}</span>
        </Link>
    );
};

const AuthButton = ({ id = null, text = '', className = '', onClick = (e) => { }, href = '', disabled = false }) => {
    return (
        <Link disabled={disabled} href={href} onClick={onClick} className={`${className} font-bold py-[0.7rem] px-4 text-sm rounded-full transition hover:bg-[var(--hover-black)] ${disabled ? 'bg-[var(--hover-light)] hover:bg-[var(--hover-light)]' : ''}`}>
            {text}
        </Link>
    )
}

const GoogleLoginButton = ({ onAuth = () => { }, onAuthError = (e) => { } }) => {
    const postSuccess = () => {
        // Redirect logged user to home
        router.get('/home')
        // Other events passed by params
        onAuth();
    }
    const onSuccess = async (credentialResponse) => {
        const userCredentials = jwtDecode(credentialResponse.credential);
        const formData = new FormData();
        formData.append('google_user', JSON.stringify(userCredentials));
        try {
            await axios.post('/users/register', formData);
            postSuccess();
        } catch (error) {
            try {
                await axios.post('/users/login', formData)
                postSuccess();
            } catch (error2) {
                console.error(error2)
            }
        }
    };
    const onError = (e) => {
        onAuthError(e);
        console.failed('Google login error: ' + e)
    }
    return (
        <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
        />
    );
}

const CloseButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="my-2 hover:cursor-pointer p-2 rounded-full transition duration-300 hover:bg-gray-200 focus:outline-none focus:bg-gray-300"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    );
};

const IconButton = ({ children, className = '', href = '', onClick = () => { } }) => {
    return (
        <Link onClick={onClick} href={href} className={`${className} p-2 rounded-full border transition duration-200 hover:bg-[var(--hover-light)]`} >
            {children}
        </Link>
    );
}


export { GlowButton, GlowSubmitButton, BouncingButton, Button, SubmitButton, BackButton, FollowButton, AuthButton, GoogleLoginButton, CloseButton, IconButton };