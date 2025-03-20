import React, { useState } from 'react';
import './Finalization1.css';
import finalization1 from '../../photos/Group 4.png';
import QuestionCard from '../../components/QuestionCard';
import { useNavigate } from "react-router-dom";

const Finalization1 = () => {
    const [questions, setQuestions] = useState([
        { question: 'What is the capital of France?' },
        { question: 'What is 2 + 2?' },
        { question: 'Which planet is known as the Red Planet?' },
    ]);

    const navigate = useNavigate();

    const handleDelete = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index); 
        setQuestions(updatedQuestions); 
    };

    return (
        <div className="wrapperFinalization1">
            <div className="rightFinalization1">
                <h1 className="Finalization1">Finalization</h1>
            </div>
            <div className="leftFinalization1">
                <img className="imageFinalization1" src={finalization1} alt="" />
                <div className="questionsContainer">
                    {questions.map((q, index) => (
                        <QuestionCard
                            key={index}
                            question={q.question}
                            onDelete={() => handleDelete(index)} 
                        />
                    ))}
                    <button className="addQuestionButton" onClick={() => navigate("/Info")}>
                        +
                    </button>
                </div>
                <button className="PublishFinalization2">Publish</button>
                <button className="saveindraft">Save in Draft</button>
                <button className="CancelFinalization2">Cancel</button>
                <button className="ReturnFinalization2">Return</button>
            </div>
        </div>
    );
};

export default Finalization1;