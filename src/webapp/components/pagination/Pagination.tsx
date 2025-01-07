import React from "react";
import { Pagination as MUIPagination } from "@material-ui/lab";
import styled from "styled-components";

type PaginationProps = {
    totalPages: number;
    currentPage: number;
    onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = React.memo(props => {
    const { onChange, totalPages, currentPage } = props;
    return (
        <Container>
            <MUIPagination
                shape="rounded"
                color="primary"
                count={totalPages}
                page={currentPage}
                onChange={onChange}
            />
        </Container>
    );
});

const Container = styled.div`
    display: flex;
    justify-content: center;
`;

Pagination.displayName = "Pagination";
