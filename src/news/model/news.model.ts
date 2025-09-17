import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../../users/model/user.model";

interface INewsCreationAttr {
    title: string;
    description: string;
    userId: number;
    imageUrl: string;
}

@Table({ tableName: 'news', updatedAt: false})
export class News extends Model<News, INewsCreationAttr> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare title: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare description: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare imageUrl: string;

    @BelongsTo(()=> User)
    user: User;
}
