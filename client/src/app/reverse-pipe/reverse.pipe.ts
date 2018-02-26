import {Pipe} from "@angular/core";
import { PipeTransform } from "@angular/core/src/change_detection/pipe_transform";

@Pipe({
  name: "reverse",
  pure: false
})
export class ReversePipe<Type> implements PipeTransform {
  public transform (values: Type[]): Type[] {
      return (values) ? values.reverse() : null;
  }
}
