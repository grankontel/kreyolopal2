const VariationList = ({ variations }) => {
    return (
        <h3 className='variations'>
            {variations.map((variation, var_index) => {
                return (<span key={var_index}>
                    {variation}
                    {var_index < variations.length - 1 ? ', ' : null}
                </span>)
            })}
        </h3>
    )

}

export default VariationList