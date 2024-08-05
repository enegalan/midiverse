
import BaseModal from './BaseModal';
import { AuthButton, CloseButton, RadioButton } from '@/Components/Buttons';
import { FloatLabelInput } from '@/Components/Inputs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { closeModal, isUserMuted, isUserBlocked } from '@/Functions';
import { Link, router } from '@inertiajs/react';
import { Dropdown } from '@/Components/Inputs';
import { ProgressBar } from 'primereact/progressbar';

const reportReasons = [
    {
        'id': 'hate',
        'label': 'Hate',
        'subtitle': 'Slurs, Racist or sexist stereotypes, Dehumanization, Incitement of fear or discrimination, Hateful references, Hateful symbols & logos',
        'value': 'hate',
        'title': 'Hate',
        'more_options': [
            {
                'id': 'slurs_tropes',
                'label': 'Slurs & Tropes',
                'subtitle': 'We prohibit targeting others with repeated slurs, tropes or other content that intends to degrade or reinforce negative or harmful stereotypes about a protected category',
                'value': 'slurs_tropes',
            },
            {
                'id': 'hateful_references',
                'label': 'Hateful References',
                'subtitle': 'We prohibit targeting individuals or groups with content that references forms of violence or violent events where a protected category was the primary target or victims, where the intent is to harass',
                'value': 'hateful_references',
            },
            {
                'id': 'dehumanization',
                'label': 'Dehumanization',
                'subtitle': 'We prohibit the dehumanization of a group of people based on their religion, caste, age, disability, serious disease, national origin, race, ethnicity, gender, gender identity, or sexual orientation',
                'value': 'dehumanization',
            },
            {
                'id': 'hateful_imagery',
                'label': 'Hateful Imagery',
                'subtitle': 'We prohibit the use of logos, symbols, or images whose purpose is to promote hostility and malice against others based on their race, religion, disability, sexual orientation, gender identity or ethnicity/national origin',
                'value': 'hateful_imagery',
            },
            {
                'id': 'incitement',
                'label': 'Incitement',
                'subtitle': 'Encouraging others to deny support to a business or service, or spreading fear against me or a group of people, because of their identity',
                'value': 'incitement',
            },
        ],
    },
    {
        'id': 'abuse_harassment',
        'label': 'Abuse & Harassment',
        'subtitle': 'Insults, Unwanted Sexual Content & Graphic Objectification, Unwanted NSFW & Graphic Content, Violent Event Denial, Targeted Harassment and Inciting Harassment',
        'value': 'abuse_harassment',
        'title': 'Abuse & Harassment',
        'more_options': [
            {
                'id': 'unwanted_nsfw_graphic_content',
                'label': 'Unwanted NSFW & Graphic Content',
                'subtitle': 'We prohibit targeting others with unwanted adult and graphic content',
                'value': 'unwanted_nsfw_graphic_content',
            },
            {
                'id': 'targeted_harassment',
                'label': 'Targeted Harassment',
                'subtitle': 'We consider targeted behavior as malicious, unreciprocated, and intended to humiliate or degrade an individual(s)',
                'value': 'targeted_harassment',
            },
            {
                'id': 'insults',
                'label': 'Insults',
                'subtitle': 'We take action against the use of insults or profanity to target others',
                'value': 'insults',
            },
            {
                'id': 'unwanted_sexual_content_graphic_objectification',
                'label': 'Unwanted Sexual Content & Graphic Objectification',
                'subtitle': 'We prohibit unwanted sexual conduct and graphic objectification that sexually objectifies an individual without their consent',
                'value': 'unwanted_sexual_content_graphic_objectification',
            },
            {
                'id': 'violent_event_denial',
                'label': 'Violent Event Denial',
                'subtitle': 'We prohibit content that denies that mass murder or other mass casualty events took place, where we can verify that the event occurred, and when the content is shared with abusive context',
                'value': 'violent_event_denial',
            },
            {
                'id': 'inciting_harassment',
                'label': 'Inciting Harassment',
                'subtitle': 'We prohibit behavior that encourages others to harass or target specific individuals or groups of people with abuse',
                'value': 'inciting_harassment',
            },
        ],
    },
    {
        'id': 'violent_speech',
        'label': 'Violent Speech',
        'subtitle': 'Violent Threats, Wish of Harm, Glorification of Violence, Incitement of Violence, Coded Incitement of Violence',
        'value': 'violent_speech',
        'title': 'Violent speech',
        'more_options': [
            {
                'id': 'violent_threats',
                'label': 'Violent Threats',
                'subtitle': 'You may not threaten to inflict physical harm on others, which includes (but is not limited to) threatening to kill, torture, sexually assault, or otherwise hurt someone',
                'value': 'violent_threats',
            },
            {
                'id': 'glorification_of_violence',
                'label': 'Glorification of Violence',
                'subtitle': 'You may not glorify, praise, or celebrate acts of violence where harm occurred, which includes (but is not limited to) expressing gratitude that someone experienced physical harm or praising Violent entities and Perpetrators of Violent Attacks. This also includes glorifying animal abuse or cruelty',
                'value': 'glorification_of_violence',
            },
            {
                'id': 'incitement_of_violence',
                'label': 'Incitement of Violence',
                'subtitle': 'You may not incite, promote, or encourage others to commit acts of violence or harm, which includes (but is not limited to) encouraging others to hurt themselves or inciting others to commit atrocity crimes including crimes against humanity, war crimes or genocide',
                'value': 'incitement_of_violence',
            },
            {
                'id': 'wish_of_harm',
                'label': 'Wish of Harm',
                'subtitle': 'You may not wish, hope, or express desire for harm. This includes (but is not limited to) hoping for others to die, suffer illnesses, tragic incidents, or experience other physically harmful consequences',
                'value': 'wish_of_harm',
            },
            {
                'id': 'coded_incitement_of_violence',
                'label': 'Coded Incitement of Violence',
                'subtitle': 'You may not use coded language (often referred to as "dog whistles") to indirectly incite violence',
                'value': 'coded_incitement_of_violence',
            },
        ],
    },
    {
        'id': 'child_safety',
        'label': 'Child Safety',
        'subtitle': 'Child sexual exploitation, grooming, physical child abuse, underage user',
        'value': 'child_safety',
        'title': 'Child safety',
        'more_options': [
            {
                'id': 'selling_or_distributing_sexually_explicit_content_involving_a_minor',
                'label': 'Selling or distributing sexually explicit content involving a minor',
                'subtitle': '',
                'value': 'selling_or_distributing_sexually_explicit_content_involving_a_minor',
            },
            {
                'id': 'sexualization_of_minors',
                'label': 'Sexualization of minors',
                'subtitle': '',
                'value': 'sexualization_of_minors'
            },
            {
                'id': 'grooming_or_online_enticement_of_minors',
                'label': 'Grooming or online enticement of minors',
                'subtitle': '',
                'value': 'grooming_or_online_enticement_of_minors'
            },
            {
                'id': 'child_sex_trafficking',
                'label': 'Child sex trafficking',
                'subtitle': '',
                'value': 'child_sex_trafficking',
            },
            {
                'id': 'physical_child_abuse',
                'label': 'Physical child abuse',
                'subtitle': 'Including media of children in physical altercations, victims of bullying or abuse',
                'value': 'physical_child_abuse',
            },
            {
                'id': 'minor_at_risk',
                'label': 'Minor at risk (e.g, adult with access to minor expressing desire to engage in sexual act)',
                'subtitle': '',
                'value': 'minor_at_risk',
            },
            {
                'id': 'generated_media_depicting_a_minor_engaging_in_a_sexual_act_or_child_like_sex_doll',
                'label': 'Illustrated, cartoon, computer generated media depicting a minor engaging in a sexual act or child-like sex doll',
                'subtitle': '',
                'value': 'generated_media_depicting_a_minor_engaging_in_a_sexual_act_or_child_like_sex_doll'
            },
            {
                'id': 'underage_user',
                'label': 'Underage user',
                'subtitle': '',
                'value': 'underage_user',
            },
            {
                'id': 'normalizing_acts_of_child_sexual_exploitation',
                'label': 'Normalizing or glorifying acts of child sexual exploitation',
                'subtitle': '',
                'value': 'normalizing_acts_of_child_sexual_exploitation',
            },
        ],
    },
    {
        'id': 'privacy',
        'label': 'Privacy',
        'subtitle': 'Sharing private information, threatening to share/expose private information, sharing non-consensual intimate images, sharing images of me that I don’t want on the platform',
        'value': 'privacy',
        'title': 'Exposing private info',
        'more_options': [
            {
                'id': 'threatening_to_share_private_personal_information_without_permission',
                'label': 'Threatening to share or sharing private personal information without permission',
                'subtitle': '',
                'value': 'threatening_to_share_private_personal_information_without_permission',
            },
            {
                'id': 'threatening_to_share_sexual_photo_video_of_me_without_permission',
                'label': 'Threatening to share or sharing a sexual, nude, or intimate photo/video of me or someone without permission',
                'subtitle': '',
                'value': 'threatening_to_share_sexual_photo_video_of_me_without_permission',
            },
            {
                'id': 'sharing_a_photo_video_of_me_that_i_do_not_want_on_the_platform',
                'label': 'Sharing a photo/video of me that I do not want on the platform',
                'subtitle': '',
                'value': 'sharing_a_photo_video_of_me_that_i_do_not_want_on_the_platform',
            },
        ],
    },
    {
        'id': 'spam',
        'label': 'Spam',
        'subtitle': 'Fake engagement, scams, fake accounts, malicious links',
        'value': 'spam',
    },
    {
        'id': 'suicide_or_self_harm',
        'label': 'Suicide or self-harm',
        'subtitle': 'Encouraging, promoting, providing instructions or sharing strategies for self-harm.',
        'value': 'suicide_or_self_harm',
        'title': 'Suicide or self-harm',
        'more_options': [
            {
                'id': 'asking_others_for_encouragement_to_engage_in_self_harm_or_suicide',
                'label': 'Asking others for encouragement to engage in self-harm or suicide',
                'subtitle': '',
                'value': 'asking_others_for_encouragement_to_engage_in_self_harm_or_suicide',
            },
            {
                'id': 'sharing_info_strategies_methods_that_would_help_people_self_harm',
                'label': 'Sharing info, strategies, or methods that would help people self-harm',
                'subtitle': '',
                'value': 'sharing_info_strategies_methods_that_would_help_people_self_harm',
            },
            {
                'id': 'expressing_tendencies_or_intention_to_engage_in_self_harm_or_suicide',
                'label': 'Expressing tendencies or intention to engage in self-harm or suicide',
                'subtitle': '',
                'value': 'expressing_tendencies_or_intention_to_engage_in_self_harm_or_suicide',
            },
        ],
    },
    {
        'id': 'sensitive_media',
        'label': 'Sensitive or disturbing media',
        'subtitle': 'Graphic Content, Gratuitous Gore, Adult Nudity & Sexual Behavior, Violent Sexual Conduct, Bestiality & Necrophilia, Media depicting a deceased individual',
        'value': 'sensitive_media',
        'title': 'Sensitive media',
        'more_options': [
            {
                'id': 'graphic_content',
                'label': 'Graphic content',
                'subtitle': 'Graphic content is any media that depicts death, violence, medical procedures, or serious physical injury in graphic detail of humans or animals',
                'value': 'graphic_content',
            },
            {
                'id': 'gratuitous_gore',
                'label': 'Gratuitous Gore',
                'subtitle': 'Gratuitous gore is any media that depicts excessively graphic or gruesome content related to death, violence or severe physical harm, or graphic content that is shared for sadistic purposes. This includes animal abuse & cruelty',
                'value': 'gratuitous_gore',
            },
            {
                'id': 'i_am_family_member_or_autherized_reported_and_i_am_reporting_media_depicting_a_deceased_individual',
                'label': 'I am a family member or authorized reporter and I am reporting media depicting a deceased individual',
                'subtitle': '',
                'value': 'i_am_family_member_or_autherized_reported_and_i_am_reporting_media_depicting_a_deceased_individual',
            },
            {
                'id': 'violent_sexual_conduct',
                'label': 'Violent sexual conduct',
                'subtitle': 'Violent sexual conduct is any media that depicts violence, whether real or simulated, in association with sexual acts.',
                'value': 'violent_sexual_conduct',
            },
        ],
    },
    {
        'id': 'impersonation',
        'label': 'Impersonation',
        'subtitle': 'Pretending to be someone else, including non-compliant parody/fan accounts',
        'value': 'impersonation',
        'title': 'Impersonation',
        'more_options': [
            {
                'id': 'pretending_to_be_me__my_brand_or_a_user_that_i_represent',
                'label': 'Pretending to be me, my brand or a user that I represent',
                'subtitle': '',
                'value': 'pretending_to_be_me__my_brand_or_a_user_that_i_represent',
            },
            {
                'id': 'someone_else_is_being_impersonated',
                'label': 'Someone else on MiDiverse is being impersonated',
                'subtitle': '',
                'value': 'someone_else_is_being_impersonated'
            },
        ],
    },
    {
        'id': 'violent_hateful_entities',
        'label': 'Violent & hateful entities',
        'subtitle': 'Violent extremism and terrorism, hate groups & networks',
        'value': 'violent_hateful_entities',
    },
];

export default function ReportUserModal({ auth_user = {}, user = {} }) {
    const [nextStepButtonDisabled, setNextStepButtonDisabled] = useState(true)
    const [nextStepButtonDisabled2, setNextStepButtonDisabled2] = useState(true)
    const [step, setStep] = useState('step1') // step1 or step2 or step3
    const [reportReason, setReportReason] = useState(null);
    const [reportDetailedReason, setReportDetailedReason] = useState(null);
    const [modalTitle, setModalTitle] = useState('Gathering info');
    var progressValue = step === 'step1' ? (100 / 3) : step === 'step2' ? (100 / 2) : (100 / 1);
    const handleNextButton = (e) => {
        e.preventDefault();
        goNextStep();
    }
    const handleNextButton2 = (e) => {
        e.preventDefault();
        goNextStep2();
    }
    const goNextStep = () => {
        setStep('step2');
        if (!Object.hasOwn(reportReason, 'more_options')) {
            goNextStep2();
        }
    }
    const goNextStep2 = () => {
        setModalTitle('Submitted')
        setStep('step3');
        // Submit report
        handleSubmit();
    }
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('reason', reportReason.value);
        if (reportDetailedReason) {
            formData.append('detailed_reason', reportDetailedReason.value);
        } else {
            formData.append('detailed_reason', '');
        }
        formData.append('user_id', user.id);
        try {
            await axios.post('/user/report/', formData)
        } catch (error) {
            console.error(error)
        }
    }
    const handleReportReason = (e) => {
        var reason_value = e.target.value;
        var reason = null;
        for (let report_reason of reportReasons) {
            if (report_reason.value === reason_value) {
                reason = report_reason;
                break;
            }
        }
        setReportReason(reason);
        setNextStepButtonDisabled(false);
    }
    const handleDetailedReportReason = (e) => {
        var reason_value = e.target.value;
        var reason = null;
        for (let report_reason of reportReasons) {
            if (!Object.hasOwn(report_reason, 'more_options')) continue;
            for (let detailed_reason of report_reason.more_options) {
                if (detailed_reason.value === reason_value) {
                    reason = detailed_reason;
                    break;
                }
            }
        }
        setReportDetailedReason(reason);
        setNextStepButtonDisabled2(false);
    }
    const [isMuted, setIsMuted] = useState(isUserMuted(user, auth_user));
    const handleMute = (e) => {
        e.preventDefault();
        var formData = new FormData();
        formData.append('user_id', user.id);
        axios.post('/user/mute', formData);
        setIsMuted(!isMuted);
    }
    const [isBlocked, setIsBlocked] = useState(isUserBlocked(user, auth_user));
    const handleBlock = (e) => {
        e.preventDefault();
        var formData = new FormData();
        formData.append('user_id', user.id);
        axios.post('/user/block', formData);
        setIsBlocked(!isBlocked);
    }
    const onClose = (e) => {
        closeModal('report-user')
    };
    return (
        <BaseModal title={modalTitle} paddingDisabled={true} logo={false} id='report-user'>
            <ProgressBar showValue={false} value={progressValue} />
            {step === 'step1' ? (
                <section className='px-32 py-4'>
                    <div className="flex justify-between pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            What type of issue are you reporting?
                        </h3>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <section className='overflow-y-scroll flex flex-col gap-6'>
                            {reportReasons.map(reason => {
                                return (
                                    <div className='flex justify-between gap-12 select-none' key={reason.id}>
                                        <div className='flex flex-col'>
                                            <label className='font-bold'>{reason.label}</label>
                                            <span className='text-[var(--grey)] text-sm'>{reason.subtitle}</span>
                                        </div>
                                        <RadioButton onChange={handleReportReason} name='report_reasons' value={reason.value} id={reason.id} />
                                    </div>
                                );
                            })}
                        </section>
                        <AuthButton disabled={nextStepButtonDisabled} className={`${nextStepButtonDisabled ? 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default' : ''} mt-5 text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleNextButton} text='Next' /> 
                    </div>
                </section>
            ) : step === 'step2' && reportReason && Object.hasOwn(reportReason, 'more_options') ? (
                <section className='px-32 py-4'>
                    <div className="flex flex-col gap-2 pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            {reportReason.title}
                        </h3>
                        <span className='text-sm text-[var(--grey)]'>Choose the best match</span>
                    </div>
                    <div className='flex flex-col gap-6'>
                        {reportReason.more_options.map(reason => {
                            return (
                                <div className='flex justify-between gap-12 select-none' key={reason.id}>
                                    <div className='flex flex-col'>
                                        <label className='font-bold'>{reason.label}</label>
                                        <span className='text-[var(--grey)] text-sm'>{reason.subtitle}</span>
                                    </div>
                                    <RadioButton onChange={handleDetailedReportReason} name='report_reasons' value={reason.value} id={reason.id} />
                                </div>
                            );
                        })}
                        <AuthButton disabled={nextStepButtonDisabled2} className={`${nextStepButtonDisabled2 ? 'bg-[var(--disabled)] hover:bg-[var(--disabled)] hover:cursor-default' : ''} mt-5 text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={handleNextButton2} text='Submit' />
                    </div>
                </section>
            ) : (
                <section className='px-32 py-4'>
                    <div className="flex flex-col gap-2 pb-6 md:pb-8 rounded-t w-full">
                        <h3 className="text-left text-3xl font-semibold text-gray-900">
                            Thanks for helping make MiDiverse better for everyone
                        </h3>
                        <span className='text-sm text-[var(--grey)]'>We know it wasn’t easy, so we appreciate you taking the time to answer those questions.</span>
                    </div>
                    <div className='my-5'>
                        <h1 className='text-lg font-bold'>What’s happening now</h1>
                        <p className='text-[var(--grey)] text-sm'>Your report is in our queue. If you attached a post to this report, we’ll hide it from your timeline.</p>
                    </div>
                    <div className='my-5'>
                        <h1 className='text-lg font-bold'>What’s next</h1>
                        <p className='text-[var(--grey)] text-sm'>It’ll take a few days for our team to review your report. We’ll notify you if we found a rule violation and we’ll let you know the actions we’re taking as a result.</p>
                    </div>
                    <div className='mt-5 mb-10 '>
                        <h1 className='text-lg font-bold'>Additional things you can do in the meantime</h1>
                        {!isMuted ? (
                            <>
                                <div className='flex flex-col gap-2'>
                                    <p className='text-[var(--grey)] text-sm'>Remove @${user.username}’s posts from your timeline without unfollowing or blocking them.</p>
                                    <AuthButton className={`mt-1 text-center w-full border bg-[var(--white)] text-black hover:bg-[var(--hover-light)]`} onClick={handleMute} text={`Mute @${user.username}`} />
                                </div>
                            </>
                        ) : (<></>)}
                        {!isBlocked ? (
                            <>
                                <div className='flex flex-col gap-2 mt-6'>
                                    <p className='text-[var(--grey)] text-sm'>Block @${user.username} from following you, viewing your posts, or messaging you. By blocking them, you also won’t see any posts or notifications from them.</p>
                                    <AuthButton className={`mt-1 text-center w-full border bg-[var(--white)] text-black hover:bg-[var(--hover-light)]`} onClick={handleBlock} text={`Block @${user.username}`} />
                                </div>
                            </>
                        ) : (<></>)}
                    </div>
                    <AuthButton className={`flex justify-center items-center text-center w-full bg-[var(--dark)] text-white hover:bg-[var(--hover-black)]`} onClick={onClose} text='Done' />
                </section>
            )}
        </BaseModal>
    );
}