from enum import Enum

class GenderEnumType(Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHERS = "Others"

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
