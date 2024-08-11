
import React from 'react';
import PropTypes from 'prop-types';

const Square = ({player, index, onClick }) => {

    const handleClick = (event) => {
        if (onClick) {
          onClick(event);
        }
    };

    return (
        <div 
            data-cell-index={index}
            className='h-36 border-solid border-4 border-slate-200 font-display text-7xl text-center flex justify-center items-center cursor-pointer'
            onClick={handleClick}
        >
            <span data-cell-index={index}>{player}</span>
        </div>
    )
}

Square.propTypes = {
    player: PropTypes.node.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
};

export default Square;