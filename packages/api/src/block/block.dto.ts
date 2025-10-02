import { ApiProperty } from "@nestjs/swagger";
import { BlockStatus } from "../block/block.entity";

export class BlockDto {
  @ApiProperty({ type: Number, description: "The height (number) of this block", example: 10 })
  public readonly number: number;

  @ApiProperty({
    type: String,
    description: "The hash of this block",
    example: "0x51f81bcdfc324a0dff2b5bec9d92e21cbebc4d5e29d3a3d30de3e03fbeab8d7f",
  })
  public readonly hash: string;

  @ApiProperty({
    type: Date,
    description: "The timestamp of this block",
    example: new Date("2022-11-21T18:16:51.000Z"),
  })
  public readonly timestamp: Date;

  @ApiProperty({
    type: String,
    description: "The total amount of gas used by all transactions in this block",
    example: "100000000",
  })
  public readonly gasUsed: string;

  @ApiProperty({
    enum: BlockStatus,
    description: "Status of the block",
    example: BlockStatus.Sealed,
    examples: [BlockStatus.Sealed, BlockStatus.Committed, BlockStatus.Proven, BlockStatus.Executed],
  })
  public readonly status: BlockStatus;

  @ApiProperty({ type: Number, description: "L1 transactions count", example: 10 })
  public readonly l1TxCount: number;

  @ApiProperty({ type: Number, description: "L2 transactions count", example: 10 })
  public readonly l2TxCount: number;

  @ApiProperty({ type: Number, description: "Block size (number of transaction in the block)", example: 20 })
  public readonly size: number;
}
