import { simpleHash } from '@kreyolopal/web-ui'

const UsageList = ({ usages }) => {
    return (
        <div className="usage">
            {usages.map((example) =>
                example !== null ? (
                    <div className="example " key={simpleHash(example)}>
                        {example}
                    </div>
                ) : null
            )}
        </div>

    )
}

export default UsageList;