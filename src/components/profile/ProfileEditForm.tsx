type ProfileEditFormProps = {
  nickname: string;
};

export function ProfileEditForm({ nickname }: ProfileEditFormProps) {
  return (
    <section className="rounded-xl border border-[#c4c6d5]/20 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#1a1b22]">Profile Details</h3>
      <p className="mt-1 text-sm text-[#434653]">
        Editing will be connected to profile persistence in a later pass.
      </p>
      <label className="mt-4 block text-sm font-medium text-[#434653]">
        Nickname
      </label>
      <input
        className="mt-2 w-full rounded-lg border border-[#c4c6d5] bg-[#f3f3fd] px-4 py-3 text-[#1a1b22]"
        defaultValue={nickname}
        disabled
      />
    </section>
  );
}

