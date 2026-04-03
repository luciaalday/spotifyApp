export default function Error({ code }) {
    const message =
        code === 404 ? 'Page not found'
            : code === 403 ? 'Unauthorized user'
                : code === 500 ? 'Internal server error'
                    : 'An unexpected error occurred';

    return (
        <main>
            <h1>Error {code}</h1>
            <p>{message}</p>
        </main>
    );
}