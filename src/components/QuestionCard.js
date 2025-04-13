import React from 'react';
import './QuestionCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const QuestionCard = ({ question, onEdit, onDelete }) => {
    return (
        <div className="questionCard">
            <div className="questionCardHeader">
                <button className="editButton" onClick={onEdit}>
                    Edit
                </button>
                <button className="deleteButton" onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
            <div className="questionCardBody">
                <h3 className="questionText">{question}</h3>
            </div>
        </div>
    );
};

export default QuestionCard;