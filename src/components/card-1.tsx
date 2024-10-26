import React, { FC } from 'react';

interface CountCardProps {
    title: string;
    count: number;
}

const CountCard: FC<CountCardProps> = ({ title, count }) => {
    return (
        <React.Fragment>
            <article className="rounded-xl bg-white ring ring-blue-50 p-4">
                <div className="flex items-start">
                    <div>
                        <p className="font-semibold text-gray-500">
                            {title}
                        </p>
                        <h3 className="text-3xl md:text-4xl font-medium">
                            {count}
                        </h3>
                    </div>
                </div>
            </article>
        </React.Fragment>
    );
};

export default CountCard;