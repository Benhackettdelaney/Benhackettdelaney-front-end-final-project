    // src/components/ActorSingle
    import React, { useState, useEffect } from "react";
    import { useParams, useNavigate } from "react-router-dom";
    import { fetchActor } from "../../apis/actor";
    import { fetchAllMovies } from "../../apis/movie";

    function ActorSingle({ authenticated }) {
    const [actor, setActor] = useState(null);
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); 
    const { actorId } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !authenticated) {
        setError("Please log in to view this page");
        navigate("/");
        return;
        }

        const fetchData = async () => {
        setLoading(true); 
        try {
            const actorData = await fetchActor(actorId, token);
            console.log("Actor Data:", actorData);
            setActor(actorData);

            const moviesData = await fetchAllMovies(token);
            console.log("All Movies Data:", moviesData);

            let actorMovies = [];
            if (actorData.movies && actorData.movies.length > 0) {
            actorMovies = moviesData.filter((movie) =>
                actorData.movies.some((actorMovie) => {
                const movieId =
                    typeof actorMovie === "object" ? actorMovie.id : actorMovie;
                return movieId === movie.id;
                })
            );
            }
            console.log("Filtered Actor Movies:", actorMovies);

            if (
            actorMovies.length === 0 &&
            actorData.movies &&
            actorData.movies.length > 0
            ) {
            actorMovies = actorData.movies.map((movie) =>
                typeof movie === "object"
                ? movie
                : { id: movie, movie_title: `Movie ID ${movie}` }
            );
            }

            setMovies(actorMovies);
        } catch (err) {
            setError(err.message || "Failed to fetch actor data");
            console.error("Error:", err);
        } finally {
            setLoading(false); 
        }
        };

        fetchData();
    }, [actorId, token, authenticated, navigate]);

    if (error) {
        return (
        <div className="container mx-auto p-6">
            <div className="alert alert-error mb-6">{error}</div>
        </div>
        );
    }

    if (loading) {
        return (
        <div className="container mx-auto p-6">
            <div className="text-center">Loading...</div>
        </div>
        );
    }

    if (!actor) {
        return (
        <div className="container mx-auto p-6">
            <div className="text-center">No actor data available.</div>
        </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-primary mb-6">{actor.name}</h2>
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
            <p>
                <strong>Description:</strong> {actor.description || "N/A"}
            </p>
            <p>
                <strong>Birthday:</strong>{" "}
                {actor.birthday
                ? new Date(actor.birthday).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
                <strong>Nationality:</strong> {actor.nationality || "N/A"}
            </p>
            <div className="mt-4">
                <h3 className="text-xl font-semibold">Movies</h3>
                {movies.length > 0 ? (
                <ul className="list-disc pl-5">
                    {movies.map((movie) => (
                    <li key={movie.id}>
                        {movie.movie_title || `Movie ID ${movie.id}`}
                    </li>
                    ))}
                </ul>
                ) : (
                <p>No movies found for this actor.</p>
                )}
            </div>
            <button
                onClick={() => navigate("/actors")}
                className="btn btn-primary mt-4"
            >
                Back to Actors List
            </button>
            </div>
        </div>
        </div>
    );
    }

    export default ActorSingle;
