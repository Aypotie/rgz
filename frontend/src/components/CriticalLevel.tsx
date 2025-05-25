interface Props {
    dangerLevel: number | null;
    setDangerLevel: (level: number) => void;
}

export const CriticalLevel = (props: Props) => {
    return (
        <div className="d-flex justify-content-between">
            {[1, 2, 3, 4, 5].map(level => {
                const bgColor =
                    level === 1 ? 'bg-success' :
                        level === 2 ? 'bg-level-2' :
                            level === 3 ? 'bg-warning' :
                                level === 4 ? 'bg-level-4' :
                                    'bg-danger';

                return (
                    <div
                        key={level}
                        className={`danger-box ${bgColor} ${props.dangerLevel === level ? 'border border-dark' : ''}`}
                        data-level={level}
                        onClick={() => props.setDangerLevel(level)}
                        style={{
                            width: '18%',
                            height: '20px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    />
                );
            })}
        </div>
    )
}