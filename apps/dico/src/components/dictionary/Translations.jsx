const Tranlations = ({ meanings }) => {
    return (<div className="translations">
        {meanings['gp']?.length > 0 ? (<div className="translation translation_gp">
            {meanings['gp']}
        </div>
        ) : null}
        {meanings['fr']?.length > 0 ? (<div className="translation translation_fr">
            {meanings['fr']}
        </div>
        ) : null}
    </div>
    )
}

export default Tranlations;