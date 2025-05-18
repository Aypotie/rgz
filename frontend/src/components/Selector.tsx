interface Data {
    id: number;
    name: string;
}

interface Props {
    label: string;
    data: Array<Data>;
    setSelectedElement: ((id: number) => void) | null;
    selectedValue?: number | null;
}

export const Selector = (props: Props) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        if (props.setSelectedElement) props.setSelectedElement(id);
    };

    return (
        <div className="mb-3">
            <label className="form-label">{props.label}</label>
            <select
                className="form-select"
                name="type"
                value={props.selectedValue || ''}
                onChange={handleChange}
            >
                {props.data.map(element => (
                    <option key={element.id} value={element.id}>
                        {element.name}
                    </option>
                ))}
            </select>
        </div>
    )
}