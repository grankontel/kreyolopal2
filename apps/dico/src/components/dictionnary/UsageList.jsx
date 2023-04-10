const UsageList = ({ usages }) => {
    return (
        <div className="usage">
            {usages.map((example, ex_index) =>
                example !== null ? (
                    <div className="example " key={ex_index}>
                        {example}
                    </div>
                ) : null
            )}
        </div>

    )
}

export default UsageList;