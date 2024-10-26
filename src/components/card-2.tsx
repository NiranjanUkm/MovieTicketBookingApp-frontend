import { Badge, Card, Group, Image, Text } from '@mantine/core';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
    id: string;
    title: string;
    image: string;
    rating: number;
}

const MovieCard: FC<MovieCardProps> = ({ id, title, image, rating }) => {
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <Card padding="lg" radius="md" withBorder onClick={() => navigate(`/details/${id}`)}>
                <Card.Section>
                    <Image
                        src={image}
                        height={160}
                        alt="Norway"
                    />
                </Card.Section>
                <Group justify="space-between" mt="md">
                    <Text fw={700} size='xl'>{title}</Text>
                    <Badge color="#0d9488">{rating + '/10'}</Badge>
                </Group>
            </Card>
        </React.Fragment>
    );
};

export default MovieCard;