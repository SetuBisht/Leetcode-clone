import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from "react-icons/ai";
import { FaRegStar, FaStar } from "react-icons/fa";
import { TiInputChecked } from "react-icons/ti";
import { Problem, ProblemList, Users } from '@/helpers/type';
import axios from 'axios';
import { ImCheckboxUnchecked } from 'react-icons/im';



const ProblemDescription = ({ user, problems }) => {
    const params = useParams();
    const [clickedProblems, setClickedProblems] = useState();
    const [clickedProblemsId, setClickedProblemId] = useState();
    const [like, setLike] = useState(false);
    const [disLike, setDisLike] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [difficultyColors] = useState([
        {
            type: 'Hard',
            textColor: 'text-red-200',
            bgColor: 'bg-red-500',
        },
        {
            type: 'Medium',
            textColor: 'text-orange-200',
            bgColor: 'bg-orange-500',
        },
        {
            type: 'Easy',
            textColor: 'text-lime-200',
            bgColor: 'bg-lime-500',
        },
    ]);

    useEffect(() => {
        if (problems) {
            problems.forEach((problem) => {
                if (problem.id === params.id) {
                    setClickedProblems(problem);
                    setClickedProblemId(problem._id);
                }
            });
        }
    }, [problems, params.id]);

    useEffect(() => {
        const ids = (user?.problemList ?? []).map((prob) => prob?._id);
        const foundIndex = ids.indexOf(clickedProblemsId);

        if (foundIndex !== -1) {
            setLike(user.problemList[foundIndex].like);
            setDisLike(user.problemList[foundIndex].dislike);
            setFavorite(user.problemList[foundIndex].favorite);
        }
    }, [user, clickedProblemsId]);

    const handleLikedProblems = async () => {
        const ids = user?.problemList.map((prob) => prob?._id);
        const foundIndex = ids.indexOf(clickedProblemsId);

        setLike((prevLike) => !prevLike);

        try {
            await axios.post('../../../api/handler/handelLikedproblems', {
                like: !like,
                index: foundIndex,
                user: user,
            });
        } catch (error) {
            console.error('Error handling liked problems:', error);
        }
    };

    const handleDisLikedProblems = async () => {
        const ids = user?.problemList.map((prob) => prob?._id);
        const foundIndex = ids.indexOf(clickedProblemsId);

        setDisLike((prevDisLike) => !prevDisLike);

        try {
            await axios.post('../../../api/handler/handelDisLikedproblems', {
                disLike: !disLike,
                index: foundIndex,
                user: user,
            });
        } catch (error) {
            console.error('Error handling disliked problems:', error);
        }
    };

    const handleFavoritesProblems = async () => {
        const ids = user?.problemList.map((prob => prob?._id));
        const foundIndex = ids.indexOf(clickedProblemsId);

        setFavorite((prevFavorite) => !prevFavorite);

        try {
            await axios.post('../../../api/handler/handelFavoritesproblems', {
                favorite: !favorite,
                index: foundIndex,
                user: user,
            });
        } catch (error) {
            console.error('Error handling favorite problems:', error);
        }
    };

    return (
        <div className='bg-slate-700'>
            <div className='flex h-11 w-full items-center pt-2 bg-slate-600 text-white overflow-x-hidden overflow-y-auto'>
                <div className="bg-slate-700 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer">
                    Description
                </div>
            </div>
            <div className='bg-slate-700'>
                <div className='text-lg text-white p-5'>
                    {clickedProblems?.order}. {clickedProblems?.title}
                </div>
                {/* Section 1 */}
                <div className='flex items-center justify-start m-2'>
                    <div className={`mx-4 px-4 py-1 w-15 rounded-full backdrop-blur-sm text-base
                        ${difficultyColors.map((difficultyTypes) => {
                            if (difficultyTypes.type === clickedProblems?.difficulty) {
                                return ` ${difficultyTypes.bgColor} `;
                            }
                        })}
                    `}>
                        {clickedProblems?.difficulty}
                    </div>
                    {/* Solved Section */}
                    <div className='mx-2 cursor-pointer'>
                        {user?.problemList.map((userProblem, index) => (
                            <div key={index}>
                                {userProblem?._id === clickedProblemsId ? (
                                    userProblem?.solved ? (
                                        <TiInputChecked size={30} color={'green'} />
                                    ) : (
                                        <ImCheckboxUnchecked size={20} color={'green'} />
                                    )
                                ) : (
                                    '' // Empty string when IDs don't match
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Liked Section */}
                    <div className='mx-2 flex cursor-pointer'>
                        <div onClick={handleLikedProblems}>
                            {like ? <AiFillLike size={20} color={'blue'} /> : <AiOutlineLike size={20} color={'blue'} />}
                        </div>
                        <span className='ml-2 cursor-pointer'>123</span>
                    </div>
                    {/* Disliked Section */}
                    <div className='mx-2 flex cursor-pointer'>
                        <div onClick={handleDisLikedProblems}>
                            {disLike ? <AiFillDislike size={20} color={'red'} /> : <AiOutlineDislike size={20} color={'red'} />}
                        </div>
                        <span className='ml-2'>123</span>
                    </div>
                    {/* Favorite Section */}
                    <div className='mx-3 cursor-pointer'>
                        <div onClick={handleFavoritesProblems}>
                            {favorite ? <FaStar size={20} color={'yellow'} /> : <FaRegStar size={20} color={'yellow'} />}
                        </div>
                    </div>
                </div>
                {/* Section 2 */}
                <div className='px-5 py-2 text-white'>
                    <div dangerouslySetInnerHTML={{ __html: clickedProblems?.problemStatement || '' }} />
                </div>
                {/* Section 3 */}
                <div className='mt-4 px-5'>
                    {clickedProblems?.examples.map((example, index) => (
                        <div key={index}>
                            <p className='font-medium text-white'>Example {example.id + 1}</p>
                            <div className='example-card'>
                                <pre>
                                    <strong className='text-white'>Input: </strong> {example.inputText}
                                    <br />
                                    <strong>Output: </strong> {example.outputText}
                                    <br />
                                    {example.explanation && (
                                        <>
                                            <strong>Explanation: </strong> {example.explanation}
                                        </>
                                    )}
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='px-5 py-2 text-white'>
                    {clickedProblems?.constraints && (
                        <>
                            Constraints:<br />
                            <strong>
                                <div className='m-5' dangerouslySetInnerHTML={{ __html: clickedProblems?.constraints || '' }} />
                            </strong>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemDescription;
